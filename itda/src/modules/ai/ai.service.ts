import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import fetch from "node-fetch";
import axios from "axios";
import { NovelService } from "../novels/novel.service";

@Injectable()
export class AiService {
  private readonly apiUrl =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  constructor(
    private readonly configService: ConfigService,
    private readonly novelService: NovelService
  ) {}

  // 📌 Gemini API를 사용해 텍스트 생성
  async generateText(prompt: string): Promise<string> {
    const apiKey = this.configService.get<string>("GOOGLE_GEMINI_KEY");

    const response = await fetch(`${this.apiUrl}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);
      return "";
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) return "";

    const lines = text.split("\n");
    const contentOnly = lines.slice(1).join("\n").trim();

    return contentOnly;
  }

  // 📌 챕터 내용을 한 문장으로 요약
  async summarizeText(content: string): Promise<string> {
    const prompt = `다음 글을 한 문장으로 요약해줘:\n\n${content}`;
    return this.generateText(prompt);
  }

  // 📌 Unsplash에서 이미지 가져오기
  private async getImageFromUnsplash(summary: string): Promise<string> {
    const query = summary.split(" ").slice(0, 3).join(" ");

    const res = await axios.get("https://api.unsplash.com/photos/random", {
      params: {
        query,
        client_id: process.env.UNSPLASH_ACCESS_KEY,
      },
    });

    return res.data.urls?.regular ?? "https://source.unsplash.com/random";
  }

  // ✅ 요약 + 이미지 생성 + 소설 저장까지 처리
  async createNovelWithAi(
    content: string,
    userId: number,
    categoryId: number,
    peopleNum: 5 | 7 | 9,
    type: "new" | "relay"
  ): Promise<any> {
    const summary = await this.summarizeText(content);
    const imageUrl = await this.getImageFromUnsplash(summary);

    const saved = await this.novelService.create({
      title: summary,
      content,
      imageUrl,
      userId,
      categoryId,
      peopleNum,
      type,
    });

    return saved;
  }
}
