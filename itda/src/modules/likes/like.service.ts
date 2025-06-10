import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { EntityManager, Not, IsNull } from "typeorm";
import { Like } from "./entities/like.entity";
import { User } from "../users/entities/user.entity";
import { Novel } from "../novels/entities/novel.entity";
import { Comment } from "../comments/entities/comment.entity";

@Injectable()
export class LikeService {
  constructor(private readonly entityManager: EntityManager) {}

  // ✅ 소설 좋아요 토글
  async toggleNovelLike(
    userId: number,
    novelId: number
  ): Promise<{ liked: boolean }> {
    const existing = await this.entityManager.findOne(Like, {
      where: {
        user: { id: userId },
        novel: { id: novelId },
      },
    });

    if (existing) {
      await this.entityManager.remove(existing);
      return { liked: false };
    } else {
      const user = await this.findUserById(userId);
      const novel = await this.findNovelById(novelId);
      const like = this.entityManager.create(Like, {
        user,
        novel,
        target_type: "novel",
      });

      try {
        await this.entityManager.save(like);
        return { liked: true };
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          throw new ConflictException("이미 좋아요한 소설입니다.");
        }
        throw error;
      }
    }
  }

  // ✅ 댓글 좋아요 토글
  async toggleCommentLike(
    userId: number,
    commentId: number
  ): Promise<{ liked: boolean }> {
    const existing = await this.entityManager.findOne(Like, {
      where: {
        user: { id: userId },
        comment: { id: commentId },
      },
    });

    if (existing) {
      await this.entityManager.remove(existing);
      return { liked: false };
    } else {
      const user = await this.findUserById(userId);
      const comment = await this.findCommentById(commentId);
      const like = this.entityManager.create(Like, {
        user,
        comment,
        target_type: "comment",
      });

      try {
        await this.entityManager.save(like);
        return { liked: true };
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          throw new ConflictException("이미 좋아요한 댓글입니다.");
        }
        throw error;
      }
    }
  }

  // ✅ 소설 좋아요 수
  async countNovelLikes(novelId: number): Promise<number> {
    return await this.entityManager.count(Like, {
      where: { novel: { id: novelId } },
    });
  }

  // ✅ 댓글 좋아요 수
  async countCommentLikes(commentId: number): Promise<number> {
    return await this.entityManager.count(Like, {
      where: { comment: { id: commentId } },
    });
  }

  // ✅ 내가 찜한 소설 목록 조회
  async findLikedNovels(userId: number): Promise<any[]> {
    const likes = await this.entityManager.find(Like, {
      where: {
        user: { id: userId },
        novel: Not(IsNull()),
      },
      relations: ["novel"],
    });

    const novels = likes.map((like) => like.novel).filter(Boolean) as Novel[];

    return await Promise.all(
      novels.map(async (novel) => {
        const likeCount = await this.countNovelLikes(novel.id);
        return {
          id: novel.id,
          title: novel.title,
          genre: novel.genre,
          imageUrl: (novel as any).imageUrl, // <- 타입 단언
          views: (novel as any).views,
          created_at: novel.created_at,
          likes: likeCount,
        };
      })
    );
  }

  // 📌 유저 조회
  private async findUserById(userId: number): Promise<User> {
    const user = await this.entityManager.findOne(User, {
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException("유저를 찾을 수 없습니다.");
    }
    return user;
  }

  // 📌 소설 조회
  private async findNovelById(novelId: number): Promise<Novel> {
    const novel = await this.entityManager.findOne(Novel, {
      where: { id: novelId },
    });
    if (!novel) {
      throw new NotFoundException("소설을 찾을 수 없습니다.");
    }
    return novel;
  }

  // 📌 댓글 조회
  private async findCommentById(commentId: number): Promise<Comment> {
    const comment = await this.entityManager.findOne(Comment, {
      where: { id: commentId },
    });
    if (!comment) {
      throw new NotFoundException("댓글을 찾을 수 없습니다.");
    }
    return comment;
  }
}
