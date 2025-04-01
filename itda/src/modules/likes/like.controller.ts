import { Controller, Post, Delete, Get, Param } from "@nestjs/common";
import { LikeService } from "./like.service";
import { Like } from "./like.entity";
import { Novel } from "../novels/novel.entity";
import { Comment } from "../interactions/comment.entity";

@Controller("likes")
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  // 📌 소설 좋아요 추가
  @Post("novel/:userId/:novelId")
  async likeNovel(
    @Param("userId") userId: number,
    @Param("novelId") novelId: number
  ): Promise<Like> {
    return this.likeService.likeNovel(userId, novelId);
  }

  // 📌 소설 좋아요 취소
  @Delete("novel/:userId/:novelId")
  async unlikeNovel(
    @Param("userId") userId: number,
    @Param("novelId") novelId: number
  ): Promise<void> {
    return this.likeService.unlikeNovel(userId, novelId);
  }

  // 📌 댓글 좋아요 추가
  @Post("comment/:userId/:commentId")
  async likeComment(
    @Param("userId") userId: number,
    @Param("commentId") commentId: number
  ): Promise<Like> {
    return this.likeService.likeComment(userId, commentId);
  }

  // 📌 댓글 좋아요 취소
  @Delete("comment/:userId/:commentId")
  async unlikeComment(
    @Param("userId") userId: number,
    @Param("commentId") commentId: number
  ): Promise<void> {
    return this.likeService.unlikeComment(userId, commentId);
  }

  // 📌 특정 소설의 좋아요 개수 조회
  @Get("novel/:novelId/count")
  async countNovelLikes(@Param("novelId") novelId: number): Promise<number> {
    return this.likeService.countNovelLikes(novelId);
  }

  // 📌 특정 댓글의 좋아요 개수 조회
  @Get("comment/:commentId/count")
  async countCommentLikes(
    @Param("commentId") commentId: number
  ): Promise<number> {
    return this.likeService.countCommentLikes(commentId);
  }
}
