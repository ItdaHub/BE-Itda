import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Body,
  Req,
  UseGuards,
  Query,
} from "@nestjs/common";
import { ChapterService } from "./chapter.service";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwtauth.guard";
import { CreateChapterDto } from "./dto/createchapter.dto";

@ApiTags("Chapters")
@Controller("chapters")
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Get(":novelId")
  @ApiOperation({ summary: "소설의 챕터 목록 조회" })
  @ApiParam({ name: "novelId", type: Number })
  async getChaptersByNovel(@Param("novelId", ParseIntPipe) novelId: number) {
    return this.chapterService.getChaptersByNovel(novelId);
  }

  @Get("content/:novelId/:chapterId")
  @ApiOperation({ summary: "챕터 본문(슬라이드 콘텐츠) 조회" })
  @ApiParam({ name: "novelId", type: Number })
  @ApiParam({ name: "chapterId", type: Number })
  async getChapterContent(
    @Param("novelId", ParseIntPipe) novelId: number,
    @Param("chapterId", ParseIntPipe) chapterId: number
  ) {
    return this.chapterService.getChapterContent(novelId, chapterId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("write/:novelId")
  @ApiOperation({
    summary: "소설에 이어쓰기 등록",
    description: "소설 ID에 해당하는 챕터를 새로 등록합니다 (이어쓰기).",
  })
  @ApiParam({ name: "novelId", type: Number })
  @ApiBody({ type: CreateChapterDto })
  async createChapter(
    @Param("novelId", ParseIntPipe) novelId: number,
    @Body() createChapterDto: CreateChapterDto,
    @Req() req
  ) {
    const user = req.user;
    // chapterNumber를 DTO에서 받도록 수정
    const { content, chapterNumber } = createChapterDto;
    return this.chapterService.createChapter(
      novelId,
      content,
      chapterNumber,
      user
    );
  }

  @Get("participation/:novelId")
  @ApiOperation({ summary: "유저가 소설에 이어쓴 기록이 있는지 확인" })
  @ApiParam({ name: "novelId", type: Number })
  @ApiQuery({ name: "userId", required: true, type: Number })
  async hasUserParticipated(
    @Param("novelId", ParseIntPipe) novelId: number,
    @Query("userId", ParseIntPipe) userId: number
  ) {
    return {
      hasParticipated: await this.chapterService.hasUserParticipatedInNovel(
        novelId,
        userId
      ),
    };
  }
}
