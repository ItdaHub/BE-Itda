import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { CommentsService } from "./comment.service";
import { JwtAuthGuard } from "../auth/jwtauth.guard";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from "@nestjs/swagger";

// 💬 댓글 관련 API 컨트롤러
@ApiTags("Comments")
@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // ✅ 댓글 생성
  @Post()
  @ApiOperation({
    summary: "댓글 생성",
    description: "소설/챕터에 댓글 또는 대댓글을 작성합니다.",
  })
  @ApiResponse({ status: 201, description: "댓글 작성 성공" })
  async create(@Body() body: any) {
    const { userId, content, novelId, chapterId, parentId } = body;
    return this.commentsService.createComment({
      userId,
      content,
      novelId,
      chapterId,
      parentId,
    });
  }

  // ✅ 댓글 조회 (소설 ID 기준, 선택적으로 챕터 ID나 userId 필터링 가능)
  @Get(":novelId")
  @ApiOperation({
    summary: "댓글 목록 조회",
    description:
      "소설 ID를 기준으로 댓글을 조회하며, 챕터 ID나 유저 ID로 필터링할 수 있습니다.",
  })
  @ApiParam({ name: "novelId", type: Number, description: "소설 ID" })
  @ApiQuery({
    name: "chapterId",
    required: false,
    type: Number,
    description: "챕터 ID",
  })
  @ApiQuery({
    name: "userId",
    required: false,
    type: Number,
    description: "작성자 ID",
  })
  @ApiResponse({ status: 200, description: "댓글 목록 반환 성공" })
  async getComments(
    @Param("novelId") novelId: number,
    @Query("chapterId") chapterId?: number,
    @Query("userId") userId?: number
  ) {
    return this.commentsService.getComments(novelId, chapterId, userId);
  }

  // ✅ 댓글 삭제
  @Delete(":id")
  @ApiOperation({
    summary: "댓글 삭제",
    description: "댓글 ID를 통해 해당 댓글을 삭제합니다.",
  })
  @ApiParam({ name: "id", type: Number, description: "댓글 ID" })
  @ApiResponse({ status: 200, description: "댓글 삭제 성공" })
  async deleteComment(@Param("id") id: number) {
    return this.commentsService.deleteComment(id);
  }

  // ✅ 댓글 신고
  @Post("/declare/:id")
  @ApiOperation({
    summary: "댓글 신고",
    description: "댓글 ID와 신고 사유를 제출하여 해당 댓글을 신고합니다.",
  })
  @ApiParam({ name: "id", type: Number, description: "댓글 ID" })
  @ApiResponse({ status: 201, description: "댓글 신고 접수 완료" })
  async reportComment(
    @Param("id") commentId: number,
    @Body("userId") userId: number,
    @Body("reason") reason: string
  ) {
    return this.commentsService.reportComment(commentId, userId, reason);
  }

  // ✅ 내가 작성한 댓글 조회
  @Get("my-comments")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "내 댓글 조회",
    description: "JWT 토큰 기반으로 로그인한 유저의 댓글을 반환합니다.",
  })
  @ApiResponse({ status: 200, description: "내 댓글 목록 반환 성공" })
  async getMyComments(@Req() req) {
    const userId = req.user.id;
    return this.commentsService.findByUser(userId);
  }
}
