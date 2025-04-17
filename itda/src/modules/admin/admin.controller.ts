import {
  Controller,
  Post,
  Param,
  UseGuards,
  ParseIntPipe,
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

  @Post("complete/:novelId")
  @ApiOperation({ summary: "소설 출품 요청 처리 (마지막 참여자 완료 시)" })
  @ApiParam({ name: "novelId", type: "number", description: "소설 ID" })
  async submitNovel(@Param("novelId", ParseIntPipe) novelId: number) {
    return this.novelService.submitNovelForCompletion(novelId);
  }
}
