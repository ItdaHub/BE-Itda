import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comment } from "../comments/comment.entity";
import { Novel } from "../novels/novel.entity";
import { User } from "../users/user.entity";
import { Chapter } from "../chapter/chapter.entity";

@Injectable()
export class InteractionsService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(Novel) private novelRepository: Repository<Novel>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Chapter) private chapterRepository: Repository<Chapter>
  ) {}

  async createComment({
    novelId,
    chapterId,
    userId,
    content,
    parentCommentId,
  }: {
    novelId: number;
    chapterId?: number;
    userId: number;
    content: string;
    parentCommentId?: number;
  }) {
    const novel = await this.novelRepository.findOne({
      where: { id: novelId },
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const chapter = chapterId
      ? await this.chapterRepository.findOne({ where: { id: chapterId } })
      : null;
    const parentComment = parentCommentId
      ? await this.commentRepository.findOne({ where: { id: parentCommentId } })
      : null;
    if (!novel || !user) throw new Error("Novel or User not found");

    const comment = this.commentRepository.create({
      novel,
      chapter,
      user,
      content,
      parent_comment: parentComment,
    });
    return this.commentRepository.save(comment);
  }

  async getCommentsByNovel(novelId: number) {
    return this.commentRepository.find({
      where: { novel: { id: novelId } },
      relations: ["user", "chapter", "parent_comment", "childComments"],
    });
  }

  async deleteComment(commentId: number) {
    return this.commentRepository.delete(commentId);
  }
}
