import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import fetch from "node-fetch";

@Injectable()
export class AiService {
  private readonly apiUrl =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"; // Gemini 2.0 Flash 모델

  constructor(private readonly configService: ConfigService) {}

  async generateNovel(
    prompt: string
  ): Promise<{ title: string; firstChapter: string }> {
    const apiKey = this.configService.get<string>("GOOGLE_GEMINI_KEY");

    const response = await fetch(`${this.apiUrl}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }], // 요청 데이터 구조에 맞게 수정
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);
      return { title: "AI 응답 없음", firstChapter: "" };
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) return { title: "AI 응답 없음", firstChapter: "" };

    const [titleLine, ...chapterLines] = text.split("\n");
    const title = titleLine.replace(/제목\s*[:：-]?\s*/, "").trim();
    const firstChapter = chapterLines.join("\n").trim();

    return { title, firstChapter };
  }
}
