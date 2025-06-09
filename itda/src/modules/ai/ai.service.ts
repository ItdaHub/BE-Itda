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
    console.log("🔑 Gemini API Key:", apiKey);

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

    return text ?? "";
  }

  // 📌 챕터 내용을 한 문장으로 요약
  async summarizeText(content: string): Promise<string> {
    const trimmed = content.slice(0, 300);
    const prompt = `
      다음 글의 핵심 키워드 5개를 영어로 추출해서 콤마로 구분해줘.
      다른 말은 하지 말고 키워드만 출력해:\n\n${trimmed}
    `.trim();

    return this.generateText(prompt);
  }

  // 📌 Unsplash에서 이미지 가져오기
  public async getImageFromUnsplash(summary: string): Promise<string> {
    const keywords = summary
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    const query = keywords.slice(0, 3).join(" ");
    console.log("🔍 이미지 검색 쿼리:", query);

    const accessKey = this.configService.get("UNSPLASH_ACCESS_KEY");
    console.log("🔐 Unsplash Access Key:", accessKey); // 디버깅용

    const res = await axios.get("https://api.unsplash.com/photos/random", {
      params: {
        query,
      },
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
    });

    // 응답 구조를 확인하여 이미지 URL이 제대로 추출되는지 점검
    console.log("Unsplash 응답:", res.data);

    return res.data.urls?.regular ?? "https://source.unsplash.com/random";
  }

  // ✅ 요약 + 이미지 생성 + 소설 저장까지 처리
  async createNovelWithAi(
    content: string,
    userId: number,
    categoryId: number,
    peopleNum: 5 | 7 | 9,
    type: "new" | "relay",
    title: string
  ): Promise<any> {
    const summary = await this.summarizeText(content);
    console.log("📄 요약 결과 (이미지 검색용):", summary);

    // 이미지 URL 가져오기
    const imageUrl = await this.getImageFromUnsplash(summary);
    if (!imageUrl) {
      throw new Error("이미지 URL을 가져오지 못했습니다.");
    }
    console.log("📷 가져온 이미지 URL:", imageUrl);

    // 실제 DB 저장 전
    console.log("💾 저장할 소설 정보:", {
      title, // 유저가 작성한 제목 사용
      content,
      imageUrl,
      userId,
      categoryId,
      peopleNum,
      type,
    });

    // DB에 소설 저장
    try {
      const saved = await this.novelService.create({
        title, // 유저가 작성한 제목 사용
        content,
        imageUrl,
        userId,
        categoryId,
        peopleNum,
        type,
      });
      console.log("📚 DB 저장 결과:", saved);
      return saved;
    } catch (error) {
      console.error("DB 저장 중 오류 발생:", error);
      throw new Error("소설 저장에 실패했습니다.");
    }
  }
}
