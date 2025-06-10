import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  ParseIntPipe,
  Query,
  Patch,
  BadRequestException,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwtauth.guard";
import { NovelService } from "./novel.service";
import { CreateNovelDto } from "./dto/createnovel.dto";
import { AddChapterDto } from "./dto/addchapter.dto";
import { Novel } from "./entities/novel.entity";
import { OptionalJwtAuthGuard } from "../auth/optionaljwt.guard";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from "@nestjs/swagger";

@ApiTags("Novel (소설)")
@Controller("novels")
export class NovelController {
  constructor(private readonly novelService: NovelService) {}

  @Get()
  @ApiOperation({ summary: "전체 소설 목록 가져오기" })
  async getAllNovels(): Promise<Novel[]> {
    return this.novelService.getAllNovels();
  }

  @Get("/published")
  @ApiOperation({ summary: "출품된 소설 목록 가져오기" })
  async getPublishedNovels(): Promise<Novel[]> {
    return this.novelService.getPublishedNovels();
  }

  @Get("/filter")
  @ApiOperation({ summary: "소설 필터링 조회" })
  async getFilteredNovels(
    @Query("type") type?: "new" | "relay",
    @Query("genre") genre?: string,
    @Query("age") age?: number,
    @Req() req?: any
  ): Promise<any[]> {
    return this.novelService.getFilteredNovels(type, genre, age);
  }

  @Get("/search")
  @ApiOperation({ summary: "소설 검색 (제목 기준)" })
  @ApiQuery({ name: "query", description: "검색어 (소설 제목 일부 또는 전체)" })
  async searchNovelsByTitle(@Query("query") query: string) {
    if (!query || query.trim() === "") {
      throw new BadRequestException("검색어가 비어있습니다.");
    }
    return this.novelService.searchNovelsByTitle(query);
  }

  @Get("/rankings")
  @ApiOperation({ summary: "통합 또는 연령대별 소설 랭킹" })
  @ApiQuery({ name: "age", required: false, description: "연령대 (예: 20)" })
  async getRanking(@Query("age") age?: string) {
    if (age !== undefined) {
      const parsedAge = parseInt(age, 10);

      if (isNaN(parsedAge)) {
        throw new BadRequestException("잘못된 연령대입니다.");
      }

      return this.novelService.getRankedNovelsByAge(parsedAge);
    }

    return this.novelService.getRankedNovels();
  }

  @UseGuards(JwtAuthGuard)
  @Get("/my")
  @ApiOperation({ summary: "내가 쓴 소설 목록 조회" })
  @ApiBearerAuth()
  getMyNovels(@Req() req) {
    const userId = req.user.id;
    return this.novelService.findMyNovels(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: "소설 처음 작성 (첫 Chapter 포함)" })
  @ApiBearerAuth()
  async createNovel(@Body() dto: CreateNovelDto, @Req() req) {
    const userId = req.user.id;
    return this.novelService.create({ ...dto, userId });
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(":id/chapters")
  @ApiOperation({ summary: "소설의 챕터 목록 조회" })
  @ApiParam({ name: "id", description: "소설 ID" })
  async getChapters(@Param("id") novelId: string) {
    return this.novelService.getChapters(parseInt(novelId, 10));
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/chapters")
  @ApiOperation({ summary: "소설에 이어쓰기 (챕터 추가)" })
  @ApiBearerAuth()
  @ApiParam({ name: "id", description: "소설 ID" })
  async addChapter(
    @Param("id") novelId: string,
    @Body() dto: AddChapterDto,
    @Req() req
  ) {
    const userId = req.user.id;
    console.log("addChapter 호출됨");
    console.log("소설 ID:", novelId);
    console.log("받은 데이터:", dto);
    console.log("요청한 사용자 ID:", userId);

    return this.novelService.addChapter(parseInt(novelId, 10), {
      ...dto,
      userId,
    });
  }

  @Get(":id/participants")
  @ApiOperation({ summary: "소설에 참여한 사용자 목록 조회" })
  @ApiParam({ name: "id", description: "소설 ID" })
  async getParticipants(@Param("id") novelId: string) {
    return this.novelService.getParticipants(parseInt(novelId, 10));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(":id")
  @ApiOperation({ summary: "소설 상세 조회 (비회원도 접근 가능)" })
  @ApiParam({ name: "id", description: "소설 ID" })
  async getNovelDetail(@Param("id", ParseIntPipe) id: number, @Req() req) {
    const userId = req.user?.id ?? null;
    return this.novelService.getNovelDetail(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id/submit")
  @ApiOperation({ summary: "소설 출품 요청" })
  @ApiBearerAuth()
  @ApiParam({ name: "id", description: "소설 ID" })
  async submitNovel(@Param("id", ParseIntPipe) id: number) {
    return this.novelService.submitNovelForCompletion(id);
  }
}
