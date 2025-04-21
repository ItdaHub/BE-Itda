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

    // Gemini로 소설 생성 (본문만 string으로 반환)
    const content = await this.aiService.generateText(prompt);

    return {
      content,
      genre,
      userId,
    };
  }

  @Post("summarize")
  async summarize(@Body("content") content: string): Promise<string> {
    return this.aiService.summarizeText(content);
  }

  // ✅ 요약 + 이미지 생성 + 저장
  @Post("summary-image-save")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "AI로 요약 + 이미지 생성 후 소설 저장" })
  async generateSummaryWithImageAndSave(
    @Body()
    body: {
      content: string;
      categoryId: number;
      peopleNum: 5 | 7 | 9;
      type: "new" | "relay";
    },
    @Req() req
  ): Promise<any> {
    const { content, categoryId, peopleNum, type } = body;
    return this.aiService.createNovelWithAi(
      content,
      req.user.id,
      categoryId,
      peopleNum,
      type
    );
  }

  // ✅ 유저가 직접 쓴 챕터 저장 요청 (사실상 동일 로직)
  @Post("user-write-save")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "유저가 쓴 소설 저장 (요약+이미지 생성 포함)" })
  async saveUserWrittenNovelWithAiData(
    @Body()
    body: {
      content: string;
      categoryId: number;
      peopleNum: 5 | 7 | 9;
      type: "new" | "relay";
    },
    @Req() req
  ): Promise<any> {
    const { content, categoryId, peopleNum, type } = body;
    return this.aiService.createNovelWithAi(
      content,
      req.user.id,
      categoryId,
      peopleNum,
      type
    );
  }
}
