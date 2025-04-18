import {
  Controller,
  Post,
  Param,
  UseGuards,
  ParseIntPipe,
  Get,
  Delete,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwtauth.guard";
import { NovelService } from "../novels/novel.service";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("Admin (관리자)")
@Controller("admin")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly novelService: NovelService) {}

  @Get("novel/:novelId")
  @ApiOperation({ summary: "소설 상세 정보 가져오기" })
  @ApiParam({ name: "novelId", type: "number", description: "소설 ID" })
  async getNovelDetail(@Param("novelId", ParseIntPipe) novelId: number) {
    return this.novelService.getNovelDetail(novelId);
  }

  @Post("complete/:novelId")
  @ApiOperation({ summary: "소설 출품 요청 처리 (마지막 참여자 완료 시)" })
  @ApiParam({ name: "novelId", type: "number", description: "소설 ID" })
  async submitNovel(@Param("novelId", ParseIntPipe) novelId: number) {
    return this.novelService.submitNovelForCompletion(novelId);
  }

  @Get("complete")
  @ApiOperation({ summary: "출품 대기 중이거나 출품된 소설 목록" })
  async getCompletedNovels() {
    return this.novelService.getCompletedNovels();
  }

  @Delete("delete/:novelId")
  @ApiOperation({ summary: "소설 삭제 (관리자 권한)" })
  @ApiParam({ name: "novelId", type: "number", description: "소설 ID" })
  async deleteNovel(@Param("novelId", ParseIntPipe) novelId: number) {
    return this.novelService.adminDeleteNovel(novelId);
  }

  @Post("publish/:novelId")
  @ApiOperation({ summary: "소설 출품 처리 (관리자 권한)" })
  @ApiParam({ name: "novelId", type: "number", description: "소설 ID" })
  async publishNovel(@Param("novelId", ParseIntPipe) novelId: number) {
    return this.novelService.adminPublishNovel(novelId);
  }
}
