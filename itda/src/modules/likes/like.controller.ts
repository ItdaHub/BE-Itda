import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
  Req,
} from "@nestjs/common";
import { LikeService } from "./like.service";
import { Like } from "./like.entity";
import { JwtAuthGuard } from "../auth/jwtauth.guard";
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from "@nestjs/swagger";

@ApiTags("Like (좋아요 / 찜)")
@Controller("likes")
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  // 📌 소설 좋아요 추가
  @Post("novel/:userId/:novelId")
  @ApiOperation({ summary: "소설 좋아요 추가" })
  @ApiParam({ name: "userId", description: "유저 ID" })
  @ApiParam({ name: "novelId", description: "소설 ID" })
  async likeNovel(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("novelId") novelId: number
  ): Promise<Like> {
    return this.likeService.likeNovel(userId, novelId);
  }

  // 📌 소설 좋아요 취소
  @Delete("novel/:userId/:novelId")
  @ApiOperation({ summary: "소설 좋아요 취소" })
  @ApiParam({ name: "userId", description: "유저 ID" })
  @ApiParam({ name: "novelId", description: "소설 ID" })
  async unlikeNovel(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("novelId") novelId: number
  ): Promise<void> {
    return this.likeService.unlikeNovel(userId, novelId);
  }

  // 📌 댓글 좋아요 추가
  @Post("comment/:userId/:commentId")
  @ApiOperation({ summary: "댓글 좋아요 추가" })
  @ApiParam({ name: "userId", description: "유저 ID" })
  @ApiParam({ name: "commentId", description: "댓글 ID" })
  async likeComment(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("commentId") commentId: number
  ): Promise<Like> {
    return this.likeService.likeComment(userId, commentId);
  }

  // 📌 댓글 좋아요 취소
  @Delete("comment/:userId/:commentId")
  @ApiOperation({ summary: "댓글 좋아요 취소" })
  @ApiParam({ name: "userId", description: "유저 ID" })
  @ApiParam({ name: "commentId", description: "댓글 ID" })
  async unlikeComment(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("commentId") commentId: number
  ): Promise<void> {
    return this.likeService.unlikeComment(userId, commentId);
  }

  // 📌 특정 소설의 좋아요 수 조회
  @Get("novel/:novelId/count")
  @ApiOperation({ summary: "소설 좋아요 수 조회" })
  @ApiParam({ name: "novelId", description: "소설 ID" })
  async countNovelLikes(
    @Param("novelId", ParseIntPipe) novelId: number
  ): Promise<number> {
    return this.likeService.countNovelLikes(novelId);
  }

  // 📌 특정 댓글의 좋아요 수 조회
  @Get("comment/:commentId/count")
  @ApiOperation({ summary: "댓글 좋아요 수 조회" })
  @ApiParam({ name: "commentId", description: "댓글 ID" })
  async countCommentLikes(
    @Param("commentId", ParseIntPipe) commentId: number
  ): Promise<number> {
    return this.likeService.countCommentLikes(commentId);
  }

  // 📌 소설 좋아요 토글
  @Patch("novel/:userId/:novelId/toggle")
  @ApiOperation({ summary: "소설 좋아요 토글 (추가/취소)" })
  @ApiParam({ name: "userId", description: "유저 ID" })
  @ApiParam({ name: "novelId", description: "소설 ID" })
  async toggleNovelLike(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("novelId", ParseIntPipe) novelId: number
  ): Promise<{ liked: boolean }> {
    return this.likeService.toggleNovelLike(userId, novelId);
  }

  // 📌 댓글 좋아요 토글
  @Patch("comment/:userId/:commentId/toggle")
  @ApiOperation({ summary: "댓글 좋아요 토글 (추가/취소)" })
  @ApiParam({ name: "userId", description: "유저 ID" })
  @ApiParam({ name: "commentId", description: "댓글 ID" })
  async toggleCommentLike(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("commentId", ParseIntPipe) commentId: number
  ): Promise<{ liked: boolean }> {
    return this.likeService.toggleCommentLike(userId, commentId);
  }

  // ❤️ 내가 찜한 소설 목록 조회
  @Get("my-likes")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "내가 찜한 소설 목록 조회" })
  @ApiBearerAuth()
  async getMyLikes(@Req() req) {
    const userId = req.user.id;
    return this.likeService.findLikedNovels(userId);
  }
}
