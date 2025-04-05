import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, IsNull } from "typeorm";
import { Comment } from "./comment.entity";
import { User } from "../users/user.entity";
import { Novel } from "../novels/novel.entity";
import { Chapter } from "../chapter/chapter.entity";
import { Report, TargetType } from "../reports/report.entity";

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
    novelId: number;
    chapterId?: number;
    parentId?: number;
  }) {
    const user = await this.userRepo.findOneByOrFail({ id: userId });
    const novel = await this.novelRepo.findOneByOrFail({ id: novelId });
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
    novelId: number,
    chapterId?: number,
    currentUserId?: number
  ) {
    const whereCondition: any = {
      novel: { id: novelId },
      parent_comment: IsNull(),
    };

    if (chapterId) {
      whereCondition.chapter = { id: chapterId };
    }

    const rootComments = await this.commentRepo.find({
      where: whereCondition,
      relations: [
        "user",
        "likes",
        "childComments",
        "childComments.user",
        "childComments.likes",
      ],
      order: { created_at: "ASC" },
    });

    const formatComment = (comment: Comment) => ({
      id: comment.id,
      writer: comment.user.nickname,
      writerId: comment.user.id,
      comment: comment.content,
      date: comment.created_at,
      likeNum: comment.likes.length,
      isliked: currentUserId
        ? comment.likes.some((like) => like.user.id === currentUserId)
        : false,
      parentId: comment.parent_comment?.id ?? null,
    });

    return rootComments.map((root) => ({
      ...formatComment(root),
      childComments: root.childComments
        .sort((a, b) => +a.created_at - +b.created_at)
        .map(formatComment),
    }));
  }

  // 댓글 삭제
  async deleteComment(id: number) {
    const comment = await this.commentRepo.findOneByOrFail({ id });

    // 대댓글이 있을 경우 함께 삭제하거나 처리 로직 추가 가능
    await this.commentRepo.remove(comment);
    return { message: "댓글이 삭제되었습니다." };
  }

  // 댓글 신고
  async reportComment(commentId: number, userId: number, reason: string) {
    // 중복 신고 방지
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

  // ✨ 유저가 작성한 댓글 목록 가져오기
  async findByUser(userId: number): Promise<Comment[]> {
    return this.commentRepo.find({
      where: { user: { id: userId } },
      relations: ["novel", "chapter"], // 필요하면 추가
      order: { created_at: "DESC" },
    });
  }
}
