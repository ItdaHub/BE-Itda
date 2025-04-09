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
  BadRequestException,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwtauth.guard";
import { NovelService } from "./novel.service";
import { CreateNovelDto } from "./dto/createnovel.dto";
import { AddChapterDto } from "./dto/addchapter.dto";
import { Novel } from "./novel.entity";
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

  // 📚 모든 소설 목록 가져오기
  @Get()
  @ApiOperation({ summary: "전체 소설 목록 가져오기" })
  async getAllNovels(): Promise<Novel[]> {
    return this.novelService.getAllNovels();
  }

  // 🔍 타입/장르로 소설 필터링
  @Get("filter")
  async getFilteredNovels(
    @Query("type") type?: "new" | "relay",
    @Query("genre") genre?: string,
    @Req() req?: any
  ): Promise<Novel[]> {
    const userId = req.user?.id;
    const genreNumber = genre ? parseInt(genre, 10) : undefined;
    return this.novelService.getFilteredNovels(type, genreNumber, userId);
  }

  // 📝 소설 처음 작성 (소설 + 첫 번째 챕터)
  @UseGuards(JwtAuthGuard) // JWT 인증 필수
  @Post()
  @ApiOperation({ summary: "소설 처음 작성 (첫 Chapter 포함)" })
  @ApiBearerAuth() // Swagger에서 JWT 토큰 필요하다고 표시
  async createNovel(@Body() dto: CreateNovelDto, @Req() req) {
    const userId = req.user.id; // 현재 로그인한 유저 ID 추출
    return this.novelService.create({ ...dto, userId }); // NovelService에 생성 요청
  }

  // ➕ 이어쓰기 (기존 소설에 새로운 챕터 추가)
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
    return this.novelService.addChapter(parseInt(novelId, 10), {
      ...dto,
      userId,
    });
  }

  // ✍️ 내가 쓴 소설 목록
  @UseGuards(JwtAuthGuard)
  @Get("/my")
  @ApiOperation({ summary: "내가 쓴 소설 목록 조회" })
  @ApiBearerAuth()
  getMyNovels(@Req() req) {
    const userId = req.user.id;
    return this.novelService.findMyNovels(userId);
  }

  // 🔎 소설 검색 (제목 기반)
  @Get("search")
  @ApiOperation({ summary: "소설 검색 (제목 기준)" })
  @ApiQuery({ name: "query", description: "검색어 (소설 제목 일부 또는 전체)" })
  async searchNovelsByTitle(@Query("query") query: string) {
    if (!query || query.trim() === "") {
      throw new BadRequestException("검색어가 비어있습니다.");
    }
    return this.novelService.searchNovelsByTitle(query);
  }

  // 📖 소설 상세 조회 (좋아요 상태 포함)
  @Get(":id")
  @ApiOperation({ summary: "소설 상세 조회 (비회원도 접근 가능)" })
  @ApiParam({ name: "id", description: "소설 ID" })
  async getNovelDetail(@Param("id", ParseIntPipe) id: number, @Req() req) {
    const userId = req.user?.id ?? null;
    return this.novelService.getNovelDetail(id, userId);
  }

  // 👥 소설 참여자 목록 조회
  @Get(":id/participants")
  @ApiOperation({ summary: "소설에 참여한 사용자 목록 조회" })
  @ApiParam({ name: "id", description: "소설 ID" })
  async getParticipants(@Param("id") novelId: string) {
    return this.novelService.getParticipants(parseInt(novelId, 10));
  }

  // 통합 랭킹
  @Get("/rankings")
  @ApiOperation({ summary: "통합 소설 랭킹 (좋아요 + 조회수 기반)" })
  getTotalRanking() {
    return this.novelService.getRankedNovels();
  }

  // 연령대별 랭킹
  @Get("/rankings/:ageGroup")
  @ApiOperation({ summary: "연령대별 소설 랭킹" })
  @ApiParam({ name: "ageGroup", type: Number })
  getRankingByAge(@Param("ageGroup") ageGroup: number) {
    return this.novelService.getRankedNovelsByAge(ageGroup);
  }
}
