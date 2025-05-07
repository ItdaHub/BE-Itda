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
  ApiResponse,
} from "@nestjs/swagger";

@ApiTags("Admin (관리자)")
@Controller("admin")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly novelService: NovelService) {}

  @Get("novel/:novelId")
  @ApiOperation({ summary: "소설 상세 정보 가져오기" })
  @ApiParam({ name: "novelId", type: Number, description: "소설 ID" })
  @ApiResponse({ status: 200, description: "소설 상세 정보 반환 성공" })
  @ApiResponse({ status: 404, description: "소설을 찾을 수 없음" })
  async getNovelDetail(@Param("novelId", ParseIntPipe) novelId: number) {
    return this.novelService.getNovelDetail(novelId);
  }

  @Get("complete")
  @ApiOperation({ summary: "출품 대기 중이거나 출품된 소설 목록 조회" })
  @ApiResponse({ status: 200, description: "소설 목록 반환 성공" })
  async getCompletedNovels() {
    return this.novelService.getCompletedNovels();
  }

  @Post("complete/:novelId")
  @ApiOperation({ summary: "소설 완료 처리 (작성자/참여자 완료)" })
  @ApiParam({ name: "novelId", type: Number, description: "소설 ID" })
  @ApiResponse({ status: 200, description: "소설이 완료 상태로 변경됨" })
  async submitNovel(@Param("novelId", ParseIntPipe) novelId: number) {
    return this.novelService.submitNovelForCompletion(novelId);
  }

  @Post("publish/:novelId")
  @ApiOperation({ summary: "소설 출품 처리 (관리자)" })
  @ApiParam({ name: "novelId", type: Number, description: "소설 ID" })
  @ApiResponse({ status: 200, description: "소설이 출품 상태로 변경됨" })
  async publishNovel(@Param("novelId", ParseIntPipe) novelId: number) {
    return this.novelService.adminPublishNovel(novelId);
  }

  @Get("waiting-novels")
  @ApiOperation({ summary: "출품 대기 중인 소설 리스트 조회 (관리자)" })
  @ApiResponse({ status: 200, description: "출품 대기 소설 리스트 반환 성공" })
  async getWaitingNovels() {
    return this.novelService.getWaitingNovelsForSubmission();
  }

  @Delete("delete/:novelId")
  @ApiOperation({ summary: "소설 삭제 (관리자 전용)" })
  @ApiParam({ name: "novelId", type: Number, description: "소설 ID" })
  @ApiResponse({ status: 200, description: "소설 삭제 성공" })
  @ApiResponse({ status: 404, description: "소설을 찾을 수 없음" })
  async deleteNovel(@Param("novelId", ParseIntPipe) novelId: number) {
    return this.novelService.adminDeleteNovel(novelId);
  }
}
