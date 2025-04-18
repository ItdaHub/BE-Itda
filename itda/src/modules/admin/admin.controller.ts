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
import { AdminGuard } from "../auth/admin.guard"; // ✅ AdminGuard import

@ApiTags("Admin (관리자)")
@Controller("admin")
@UseGuards(JwtAuthGuard, AdminGuard) // ✅ JwtAuthGuard와 AdminGuard 모두 적용
@ApiBearerAuth() // API 인증을 위한 Bearer Token 사용
export class AdminController {
  constructor(private readonly novelService: NovelService) {}

  @Post("complete/:novelId")
  @ApiOperation({ summary: "소설 출품 요청 처리 (마지막 참여자 완료 시)" })
  @ApiParam({ name: "novelId", type: "number", description: "소설 ID" })
  async submitNovel(@Param("novelId", ParseIntPipe) novelId: number) {
    return this.novelService.submitNovelForCompletion(novelId);
  }

  @Get("complete")
  @ApiOperation({ summary: "출품 대기 중이거나 출품된 소설 목록" })
  async getCompletedNovels() {
    return this.novelService.getCompletedNovels(); // 해당 메서드를 NovelService에 구현
  }

  @Delete("delete/:novelId")
  @ApiOperation({ summary: "소설 삭제 (관리자 권한)" })
  @ApiParam({ name: "novelId", type: "number", description: "소설 ID" })
  async deleteNovel(@Param("novelId", ParseIntPipe) novelId: number) {
    return this.novelService.adminDeleteNovel(novelId); // 소설 삭제 로직
  }

  @Post("publish/:novelId")
  @ApiOperation({ summary: "소설 출품 처리 (관리자 권한)" })
  @ApiParam({ name: "novelId", type: "number", description: "소설 ID" })
  async publishNovel(@Param("novelId", ParseIntPipe) novelId: number) {
    return this.novelService.adminPublishNovel(novelId); // 소설 출품 처리 로직
  }
}
