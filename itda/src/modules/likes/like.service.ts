import { Injectable, NotFoundException } from "@nestjs/common";
import { Not, IsNull } from "typeorm";
import { EntityManager } from "typeorm";
import { Like } from "./like.entity";
import { User } from "../users/user.entity";
import { Novel } from "../novels/novel.entity";
import { Comment } from "../comments/comment.entity";

@Injectable()
export class LikeService {
  constructor(private readonly entityManager: EntityManager) {}

  // 📌 소설 좋아요 추가
  async likeNovel(userId: number, novelId: number): Promise<Like> {
    const user = await this.findUserById(userId);
    const novel = await this.findNovelById(novelId);

    const existingLike = await this.entityManager.findOne(Like, {
      where: { user, novel },
    });
    if (existingLike) {
      throw new NotFoundException("You already liked this novel");
    }

    const like = this.entityManager.create(Like, {
      user,
      novel,
      target_type: "novel",
    });
    return await this.entityManager.save(like);
  }

  // 📌 소설 좋아요 취소
  async unlikeNovel(userId: number, novelId: number): Promise<void> {
    const user = await this.findUserById(userId);
    const result = await this.entityManager.delete(Like, {
      user,
      novel: { id: novelId },
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Like not found for novel ID ${novelId}`);
    }
  }

  // 📌 소설 좋아요 토글
  async toggleNovelLike(
    userId: number,
    novelId: number
  ): Promise<{ liked: boolean }> {
    const user = await this.findUserById(userId);
    const novel = await this.findNovelById(novelId);

    const existingLike = await this.entityManager.findOne(Like, {
      where: { user, novel },
    });

    if (existingLike) {
      await this.entityManager.remove(existingLike);
      return { liked: false };
    } else {
      const like = this.entityManager.create(Like, {
        user,
        novel,
        target_type: "novel",
      });
      await this.entityManager.save(like);
      return { liked: true };
    }
  }

  // 📌 댓글 좋아요 추가
  async likeComment(userId: number, commentId: number): Promise<Like> {
    const user = await this.findUserById(userId);
    const comment = await this.findCommentById(commentId);

    const existingLike = await this.entityManager.findOne(Like, {
      where: { user, comment },
    });
    if (existingLike) {
      throw new NotFoundException("You already liked this comment");
    }

    const like = this.entityManager.create(Like, {
      user,
      comment,
      target_type: "comment",
    });
    return await this.entityManager.save(like);
  }

  // 📌 댓글 좋아요 취소
  async unlikeComment(userId: number, commentId: number): Promise<void> {
    const user = await this.findUserById(userId);
    const result = await this.entityManager.delete(Like, {
      user,
      comment: { id: commentId },
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Like not found for comment ID ${commentId}`);
    }
  }

  // 📌 댓글 좋아요 토글
  async toggleCommentLike(
    userId: number,
    commentId: number
  ): Promise<{ liked: boolean }> {
    const user = await this.findUserById(userId);
    const comment = await this.findCommentById(commentId);

    const existingLike = await this.entityManager.findOne(Like, {
      where: { user, comment },
    });

    if (existingLike) {
      await this.entityManager.remove(existingLike);
      return { liked: false };
    } else {
      const like = this.entityManager.create(Like, {
        user,
        comment,
        target_type: "comment",
      });
      await this.entityManager.save(like);
      return { liked: true };
    }
  }

  // 📌 소설 좋아요 개수
  async countNovelLikes(novelId: number): Promise<number> {
    return await this.entityManager.count(Like, {
      where: { novel: { id: novelId } },
    });
  }

  // 📌 댓글 좋아요 개수
  async countCommentLikes(commentId: number): Promise<number> {
    return await this.entityManager.count(Like, {
      where: { comment: { id: commentId } },
    });
  }

  // 📌 유저가 좋아요한 소설 목록
  async getLikedNovels(userId: number): Promise<Novel[]> {
    const likes = await this.entityManager.find(Like, {
      where: { user: { id: userId }, target_type: "novel" },
      relations: ["novel"],
    });
    return likes.map((like) => like.novel).filter(Boolean) as Novel[];
  }

  // 📌 유저 조회
  private async findUserById(userId: number): Promise<User> {
    const user = await this.entityManager.findOne(User, {
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  // 📌 소설 조회
  private async findNovelById(novelId: number): Promise<Novel> {
    const novel = await this.entityManager.findOne(Novel, {
      where: { id: novelId },
    });
    if (!novel) {
      throw new NotFoundException(`Novel with ID ${novelId} not found`);
    }
    return novel;
  }

  // 📌 댓글 조회
  private async findCommentById(commentId: number): Promise<Comment> {
    const comment = await this.entityManager.findOne(Comment, {
      where: { id: commentId },
    });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }
    return comment;
  }

  // 📌 내가 좋아요한 소설 목록 조회
  async findLikedNovels(userId: number): Promise<Novel[]> {
    const likes = await this.entityManager.find(Like, {
      where: {
        user: { id: userId },
        novel: Not(IsNull()),
      },
      relations: ["novel"],
    });

    return likes.map((like) => like.novel).filter(Boolean) as Novel[];
  }
}
