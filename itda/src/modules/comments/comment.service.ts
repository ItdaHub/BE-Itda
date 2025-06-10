import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, IsNull } from "typeorm";
import { Comment } from "./entities/comment.entity";
import { User } from "../users/entities/user.entity";
import { Novel } from "../novels/entities/novel.entity";
import { Chapter } from "../chapter/entities/chapter.entity";
import { Report, TargetType } from "../reports/entities/report.entity";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Novel)
    private readonly novelRepo: Repository<Novel>,
    @InjectRepository(Chapter)
    private readonly chapterRepo: Repository<Chapter>,
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>
  ) {}

  async createComment({
    userId,
    content,
    novelId,
    chapterId,
    parentId,
  }: {
    userId: number;
    content: string;
    novelId?: number;
    chapterId?: number;
    parentId?: number;
  }) {
    const user = await this.userRepo.findOneByOrFail({ id: userId });

    if (!parentId && !novelId && !chapterId) {
      throw new Error("소설 ID 또는 챕터 ID는 필수입니다.");
    }

    const novel = novelId
      ? await this.novelRepo.findOneByOrFail({ id: novelId })
      : null;
    const chapter = chapterId
      ? await this.chapterRepo.findOneBy({ id: chapterId })
      : null;
    const parent = parentId
      ? await this.commentRepo.findOneBy({ id: parentId })
      : null;

    const newComment = this.commentRepo.create({
      user,
      novel,
      chapter,
      content,
      parent_comment: parent,
    });

    return await this.commentRepo.save(newComment);
  }

  // 댓글 가공
  async getComments(
    novelId?: number,
    chapterId?: number,
    currentUserId?: number
  ) {
    const whereCondition: any = {
      parent_comment: IsNull(),
    };

    if (chapterId) {
      // ✅ 챕터 댓글만 보기
      whereCondition.chapter = { id: chapterId };
    } else if (novelId) {
      // ✅ 소설 댓글만 보기 (chapter는 null인 것만)
      whereCondition.novel = { id: novelId };
      whereCondition.chapter = IsNull();
    }

    const rootComments = await this.commentRepo.find({
      where: whereCondition,
      relations: [
        "user",
        "likes",
        "likes.user",
        "childComments",
        "childComments.user",
        "childComments.likes",
        "childComments.likes.user",
        "childComments.parent_comment",
        "parent_comment",
      ],
      order: { created_at: "ASC" },
    });

    const formatComment = (comment: Comment) => {
      const createdAt =
        comment.created_at instanceof Date
          ? comment.created_at.toISOString()
          : null;

      const isLikedByUser = currentUserId
        ? comment.likes?.some((like) => like.user?.id === currentUserId)
        : false;

      return {
        id: comment.id,
        writer: comment.user?.nickname ?? comment.user?.email ?? "익명",
        writerId: comment.user?.id ?? null,
        comment: comment.content,
        date: createdAt,
        likeNum: comment.likes?.length ?? 0,
        isliked: isLikedByUser,
        parentId: comment.parent_comment?.id ?? null,
      };
    };

    const flatComments = rootComments.flatMap((root) => {
      const rootFormatted = formatComment(root);
      const childFormatted = (root.childComments ?? []).map(formatComment);
      return [rootFormatted, ...childFormatted];
    });

    return flatComments;
  }

  async deleteComment(id: number) {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ["childComments"],
    });

    if (!comment) {
      throw new Error("댓글을 찾을 수 없습니다.");
    }

    if (comment.childComments && comment.childComments.length > 0) {
      await this.commentRepo.remove(comment.childComments);
    }

    await this.commentRepo.remove(comment);

    return { message: "댓글 및 대댓글이 삭제되었습니다." };
  }

  async deleteComments(ids: number[]): Promise<void> {
    const comments = await this.commentRepo.find({
      where: ids.map((id) => ({ id })),
      relations: ["childComments"],
    });

    if (comments.length !== ids.length) {
      throw new Error("댓글을 찾을 수 없습니다.");
    }

    // 대댓글 먼저 모아서 삭제
    const allChildComments = comments.flatMap(
      (comment) => comment.childComments
    );
    if (allChildComments.length > 0) {
      await this.commentRepo.remove(allChildComments);
    }

    await this.commentRepo.remove(comments);
  }

  async reportComment(commentId: number, userId: number, reason: string) {
    const alreadyReported = await this.reportRepository.findOne({
      where: {
        reporter: { id: userId },
        target_type: TargetType.COMMENT,
        target_id: commentId,
      },
    });

    if (alreadyReported) {
      throw new Error("이미 신고한 댓글입니다.");
    }

    const reporter = await this.userRepo.findOneByOrFail({ id: userId });

    const report = this.reportRepository.create({
      reporter,
      target_type: TargetType.COMMENT,
      target_id: commentId,
      reason,
    });

    await this.reportRepository.save(report);

    return { message: "댓글 신고가 접수되었습니다." };
  }

  async findByUser(userId: number): Promise<Comment[]> {
    return this.commentRepo.find({
      where: { user: { id: userId } },
      relations: ["novel", "chapter"],
      order: { created_at: "DESC" },
    });
  }
}
