import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Body,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ChapterService } from "./chapter.service";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
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
  @ApiResponse({ status: 200, description: "챕터 목록 반환 성공" })
  async getChaptersByNovel(@Param("novelId", ParseIntPipe) novelId: number) {
    return this.chapterService.getChaptersByNovel(novelId);
  }

  @Get("content/:novelId/:chapterId")
  @ApiOperation({ summary: "챕터 본문(슬라이드 콘텐츠) 조회" })
  @ApiParam({ name: "novelId", type: Number })
  @ApiParam({ name: "chapterId", type: Number })
  @ApiResponse({ status: 200, description: "챕터 콘텐츠 반환 성공" })
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
  @ApiParam({ name: "novelId", type: Number, description: "소설 ID" })
  @ApiBody({ type: CreateChapterDto }) // 👉 Swagger에서도 DTO 기반으로 문서 생성됨
  @ApiResponse({ status: 201, description: "챕터 등록 성공" })
  async createChapter(
    @Param("novelId", ParseIntPipe) novelId: number,
    @Body() createChapterDto: CreateChapterDto,
    @Req() req
  ) {
    const user = req.user;
    return this.chapterService.createChapter(
      novelId,
      createChapterDto.content,
      user
    );
  }
}
