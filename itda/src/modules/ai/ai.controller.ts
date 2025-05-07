import { Controller, Post, Body, Req, UseGuards } from "@nestjs/common";
import { AiService } from "./ai.service";
import { JwtAuthGuard } from "../auth/jwtauth.guard";
import { NovelService } from "../novels/novel.service";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
} from "@nestjs/swagger";
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: "AI로 소설 생성 (저장되지 않음)",
    description: "Gemini를 이용해 프롬프트 기반 소설을 생성합니다.",
  })
  @ApiBody({ type: CreateAiDto })
  @ApiResponse({ status: 201, description: "소설 본문 문자열 반환" })
  async generateWithAI(@Body() body: CreateAiDto, @Req() req) {
    const { prompt, genre } = body;
    const userId = req.user.id;

    const content = await this.aiService.generateText(prompt);

    return {
      content,
      genre,
      userId,
    };
  }

  @Post("summarize")
  @ApiOperation({
    summary: "소설 본문 요약",
    description: "본문 내용을 요약합니다.",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        content: { type: "string", example: "긴 소설 본문 내용..." },
      },
    },
  })
  @ApiResponse({ status: 200, description: "요약된 텍스트 반환" })
  async summarize(@Body("content") content: string): Promise<string> {
    return this.aiService.summarizeText(content);
  }

  @Post("user-write-save")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "유저 작성 소설 저장 (요약+이미지 생성 포함)",
    description:
      "유저가 직접 작성한 소설을 저장하며, AI가 요약과 이미지를 생성합니다.",
  })
  @ApiBody({
    schema: {
      type: "object",
      required: ["title", "content", "categoryId", "peopleNum", "type"],
      properties: {
        title: { type: "string", example: "용사의 여정" },
        content: { type: "string", example: "소설 본문 내용..." },
        categoryId: { type: "number", example: 1 },
        peopleNum: { type: "number", enum: [5, 7, 9], example: 5 },
        type: { type: "string", enum: ["new", "relay"], example: "new" },
      },
    },
  })
  @ApiResponse({ status: 201, description: "소설 저장 성공 응답" })
  async saveUserWrittenNovelWithAiData(
    @Body()
    body: {
      title: string;
      content: string;
      categoryId: number;
      peopleNum: 5 | 7 | 9;
      type: "new" | "relay";
    },
    @Req() req
  ): Promise<any> {
    const { title, content, categoryId, peopleNum, type } = body;
    return this.aiService.createNovelWithAi(
      content,
      req.user.id,
      categoryId,
      peopleNum,
      type,
      title
    );
  }
}
