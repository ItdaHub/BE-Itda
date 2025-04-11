import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import fetch from "node-fetch";

@Injectable()
export class AiService {
  private readonly apiUrl =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"; // Gemini 2.0 Flash 모델

  constructor(private readonly configService: ConfigService) {}

  async generateNovel(prompt: string): Promise<string> {
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
    const contentOnly = lines.slice(1).join("\n").trim(); // 제목 제외하고 본문만

    return contentOnly;
  }
}
