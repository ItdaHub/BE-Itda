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

  @Get("complete")
  @ApiOperation({ summary: "출품 대기 중이거나 출품된 소설 목록" })
  async getCompletedNovels() {
    return this.novelService.getCompletedNovels();
  }

  // 완료 처리 (작성자/참여자가 끝냈을 때)
  @Post("complete/:novelId")
  async submitNovel(@Param("novelId", ParseIntPipe) novelId: number) {
    return this.novelService.submitNovelForCompletion(novelId); // status = COMPLETED
  }

  // 출품 처리 (관리자가 출품 버튼 누를 때)
  @Post("publish/:novelId")
  async publishNovel(@Param("novelId", ParseIntPipe) novelId: number) {
    return this.novelService.adminPublishNovel(novelId); // status = SUBMITTED
  }

  // 출품 대기 중 소설 리스트 (관리자용 목록)
  @Get("waiting-novels")
  async getWaitingNovels() {
    return this.novelService.getWaitingNovelsForSubmission(); // status = COMPLETED 리스트
  }

  @Delete("delete/:novelId")
  @ApiOperation({ summary: "소설 삭제 (관리자 권한)" })
  @ApiParam({ name: "novelId", type: "number", description: "소설 ID" })
  async deleteNovel(@Param("novelId", ParseIntPipe) novelId: number) {
    return this.novelService.adminDeleteNovel(novelId);
  }
}
