import { Controller, Post, Body, Req, UseGuards } from "@nestjs/common";
import { AiService } from "./ai.service";
import { JwtAuthGuard } from "../auth/jwtauth.guard";
import { NovelService } from "../novels/novel.service";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { CreateAiDto } from "./dto/create-ai.dto";

@ApiTags("AI")
@Controller("ai")
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly novelService: NovelService
  ) {}

  @Post("/generate")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "AI로 소설 생성 (저장 X)" })
  @ApiBearerAuth()
  async generateWithAI(@Body() body: CreateAiDto, @Req() req) {
    const { prompt, genre } = body;
    const userId = req.user.id;

    // Gemini로 소설 생성
    const aiResponse = await this.aiService.generateNovel(prompt);

    // 클라이언트에 응답만 해줌 (DB 저장은 안 함)
    return {
      title: aiResponse.title,
      content: aiResponse.firstChapter,
      genre,
      userId,
    };
  }
}
