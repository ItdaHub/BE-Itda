import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { ChapterService } from "./chapter.service";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";

// 📚 Chapter 관련 API 컨트롤러
@ApiTags("Chapters")
@Controller("chapters")
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  // ✅ 소설 ID로 해당 소설의 모든 챕터 목록을 가져오기
  @Get(":novelId")
  @ApiOperation({
    summary: "소설의 챕터 목록 조회",
    description: "소설 ID를 통해 해당 소설의 모든 챕터 리스트를 반환합니다.",
  })
  @ApiParam({ name: "novelId", type: Number, description: "소설 ID" })
  @ApiResponse({ status: 200, description: "챕터 목록 반환 성공" })
  async getChaptersByNovel(@Param("novelId", ParseIntPipe) novelId: number) {
    return this.chapterService.getChaptersByNovel(novelId);
  }

  // ✅ 챕터 ID로 해당 챕터의 슬라이드 콘텐츠(본문) 가져오기
  @Get("content/:chapterId")
  @ApiOperation({
    summary: "챕터 본문(슬라이드 콘텐츠) 조회",
    description: "챕터 ID를 통해 해당 챕터의 콘텐츠를 반환합니다.",
  })
  @ApiParam({ name: "chapterId", type: Number, description: "챕터 ID" })
  @ApiResponse({ status: 200, description: "챕터 콘텐츠 반환 성공" })
  async getChapterContent(@Param("chapterId", ParseIntPipe) chapterId: number) {
    return this.chapterService.getChapterContent(chapterId);
  }
}
