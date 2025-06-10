import { Controller, Get } from "@nestjs/common";
import { GenreService } from "./genre.service";
import { Genre } from "./entities/genre.entity";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

// 📚 장르(카테고리) 관련 API 컨트롤러
@ApiTags("Categories")
@Controller("categories")
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  // ✅ 모든 장르 목록 조회
  @Get()
  @ApiOperation({
    summary: "장르 목록 조회",
    description: "소설의 장르(카테고리)를 전부 조회합니다.",
  })
  @ApiResponse({ status: 200, description: "장르 목록 반환" })
  async getAllGenres(): Promise<Genre[]> {
    return this.genreService.getAllGenres();
  }
}
