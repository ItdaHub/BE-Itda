import {
  Controller,
  Post,
  Body,
  Get,
  Param,
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
  ApiBearerAuth,
  ApiBody,
} from "@nestjs/swagger";
import { CreateCommentDto } from "./dto/createcomment.dto";
import { DeleteCommentsDto } from "./dto/deletecomments.dto";
import { ReportCommentDto } from "./dto/reportcomment.dto";

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
  @ApiBody({ type: CreateCommentDto })
  async create(@Body() createCommentDto: CreateCommentDto) {
    // 논리적으로 novelId 또는 chapterId가 없는 경우를 처리
    if (
      !createCommentDto.parentId &&
      !createCommentDto.novelId &&
      !createCommentDto.chapterId
    ) {
      throw new Error("소설 ID 또는 챕터 ID는 하나는 필요합니다.");
    }

    return this.commentsService.createComment(createCommentDto);
  }

  // ✅ 소설 댓글 조회
  @Get("/novel/:novelId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "소설 댓글 조회 (좋아요 여부 포함)",
    description:
      "소설 ID 기준으로 소설 댓글을 조회합니다. 로그인한 유저가 좋아요 누른 댓글은 isLiked=true로 표시됩니다.",
  })
  @ApiParam({ name: "novelId", type: Number, description: "소설 ID" })
  @ApiResponse({ status: 200, description: "소설 댓글 목록 반환 성공" })
  async getNovelComments(@Req() req, @Param("novelId") novelId: number) {
    const loginUserId = req.user?.id;
    return this.commentsService.getComments(novelId, undefined, loginUserId);
  }

  // ✅ 챕터 댓글 조회
  @Get("/chapter/:chapterId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "챕터 댓글 조회 (좋아요 여부 포함)",
    description:
      "챕터 ID 기준으로 챕터 댓글을 조회합니다. 로그인한 유저가 좋아요 누른 댓글은 isLiked=true로 표시됩니다.",
  })
  @ApiParam({ name: "chapterId", type: Number, description: "챕터 ID" })
  @ApiResponse({ status: 200, description: "챕터 댓글 목록 반환 성공" })
  async getChapterComments(@Req() req, @Param("chapterId") chapterId: number) {
    const loginUserId = req.user?.id;
    return this.commentsService.getComments(undefined, chapterId, loginUserId);
  }

  // ✅ 댓글 여러개 삭제
  @Delete("/bulk-delete")
  @ApiOperation({
    summary: "댓글 여러 개 삭제",
    description: "여러 댓글 ID를 통해 해당 댓글들을 삭제합니다.",
  })
  @ApiResponse({ status: 200, description: "댓글 여러 개 삭제 성공" })
  @ApiBody({ type: DeleteCommentsDto })
  async deleteComments(@Body() dto: DeleteCommentsDto) {
    return this.commentsService.deleteComments(dto.ids);
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
  @ApiBody({ type: ReportCommentDto })
  async reportComment(
    @Param("id") commentId: number,
    @Body() dto: ReportCommentDto
  ) {
    return this.commentsService.reportComment(
      commentId,
      dto.userId,
      dto.reason
    );
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
