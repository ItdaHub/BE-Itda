import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
  Req,
} from "@nestjs/common";
import { LikeService } from "./like.service";
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

  // ✅ 소설 좋아요 토글
  @Patch("novel/:novelId/toggle")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "소설 좋아요 토글 (추가/취소)" })
  async toggleNovelLike(
    @Req() req,
    @Param("novelId", ParseIntPipe) novelId: number
  ): Promise<{ liked: boolean }> {
    return this.likeService.toggleNovelLike(req.user.id, novelId);
  }

  // ✅ 댓글 좋아요 토글
  @Patch("comment/:commentId/toggle")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "댓글 좋아요 토글 (추가/취소)" })
  async toggleCommentLike(
    @Req() req,
    @Param("commentId", ParseIntPipe) commentId: number
  ): Promise<{ liked: boolean }> {
    return this.likeService.toggleCommentLike(req.user.id, commentId);
  }

  // ✅ 내가 찜한 소설 목록 조회
  @Get("my-likes")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "내가 찜한 소설 목록 조회" })
  async getMyLikes(@Req() req) {
    return this.likeService.findLikedNovels(req.user.id);
  }

  // ✅ 소설 좋아요 수 조회
  @Get("novel/:novelId/count")
  @ApiOperation({ summary: "소설 좋아요 수 조회" })
  async countNovelLikes(
    @Param("novelId", ParseIntPipe) novelId: number
  ): Promise<number> {
    return this.likeService.countNovelLikes(novelId);
  }

  // ✅ 댓글 좋아요 수 조회
  @Get("comment/:commentId/count")
  @ApiOperation({ summary: "댓글 좋아요 수 조회" })
  async countCommentLikes(
    @Param("commentId", ParseIntPipe) commentId: number
  ): Promise<number> {
    return this.likeService.countCommentLikes(commentId);
  }
}
