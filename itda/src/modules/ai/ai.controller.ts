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
  @ApiOperation({ summary: "AI로 소설 생성" })
  @ApiBearerAuth()
  async generateWithAI(@Body() body: CreateAiDto, @Req() req) {
    const { prompt, genre } = body;
    const userId = req.user.id;

    // Gemini로 소설 생성
    const aiResponse = await this.aiService.generateNovel(prompt);

    // novelService에 넘길 payload 구성
    const novelPayload: any = {
      title: aiResponse.title,
      content: aiResponse.firstChapter,
      userId,
    };

    // genre 필드가 CreateNovelInput에 존재할 경우만 포함
    if (genre) {
      novelPayload.genre = genre;
    }

    // 생성된 소설을 데이터베이스에 저장
    return this.novelService.create(novelPayload);
  }
}
