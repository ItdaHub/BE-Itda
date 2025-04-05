import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { WritersService } from "../writers/writers.service";
import { ApiTags, ApiOperation, ApiParam } from "@nestjs/swagger";

@ApiTags("Writers (작성자)")
@Controller("writers")
export class WritersController {
  constructor(private readonly writersService: WritersService) {}

  // 📌 특정 챕터의 작성자 닉네임 조회
  @Get(":chapterId")
  @ApiOperation({ summary: "챕터 ID로 작성자 닉네임 조회" })
  @ApiParam({
    name: "chapterId",
    description: "조회할 챕터 ID",
    type: Number,
  })
  async getWriterNickname(@Param("chapterId", ParseIntPipe) chapterId: number) {
    const nickname =
      await this.writersService.getNicknameByChapterId(chapterId);
    return { nickname };
  }
}
