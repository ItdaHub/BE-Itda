import { Controller, Post, Body, Param, Get, Delete } from "@nestjs/common";
import { InteractionsService } from "./interaction.service";

@Controller("interactions")
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @Post("vote")
  createVote(
    @Body()
    createVoteDto: {
      novelId: number;
      userId: number;
      result: "agree" | "disagree";
    }
  ) {
    return this.interactionsService.createVote(createVoteDto);
  }

  @Post("comment")
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

  @Get("comments/:novelId")
  getCommentsByNovel(@Param("novelId") novelId: number) {
    return this.interactionsService.getCommentsByNovel(novelId);
  }

  @Delete("comment/:commentId")
  deleteComment(@Param("commentId") commentId: number) {
    return this.interactionsService.deleteComment(commentId);
  }
}
