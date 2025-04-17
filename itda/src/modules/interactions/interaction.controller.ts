import { Controller, Post, Body, Param, Get, Delete } from "@nestjs/common";
import { InteractionsService } from "./interaction.service";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

// 🗳️ 투표 및 댓글 관련 인터랙션 API
@ApiTags("Interactions")
@Controller("interactions")
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  // ✅ 댓글 생성
  @Post("comment")
  @ApiOperation({
    summary: "댓글 작성",
    description:
      "소설 또는 특정 챕터에 댓글을 작성합니다. parentCommentId를 포함하면 대댓글로 등록됩니다.",
  })
  @ApiResponse({ status: 201, description: "댓글 생성 성공" })
  createComment(
    @Body()
    createCommentDto: {
      novelId: number;
      chapterId?: number;
      userId: number;
      content: string;
      parentCommentId?: number;
    }
  ) {
    return this.interactionsService.createComment(createCommentDto);
  }

  // ✅ 소설 ID로 댓글 조회
  @Get("comments/:novelId")
  @ApiOperation({
    summary: "소설 댓글 조회",
    description: "특정 소설에 등록된 모든 댓글을 조회합니다.",
  })
  @ApiResponse({ status: 200, description: "댓글 목록 반환" })
  getCommentsByNovel(@Param("novelId") novelId: number) {
    return this.interactionsService.getCommentsByNovel(novelId);
  }

  // ✅ 댓글 삭제
  @Delete("comment/:commentId")
  @ApiOperation({
    summary: "댓글 삭제",
    description: "특정 댓글을 삭제합니다.",
  })
  @ApiResponse({ status: 200, description: "댓글 삭제 성공" })
  deleteComment(@Param("commentId") commentId: number) {
    return this.interactionsService.deleteComment(commentId);
  }
}
