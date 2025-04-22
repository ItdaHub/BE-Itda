"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const node_fetch_1 = require("node-fetch");
const axios_1 = require("axios");
const novel_service_1 = require("../novels/novel.service");
let AiService = class AiService {
    configService;
    novelService;
    apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    constructor(configService, novelService) {
        this.configService = configService;
        this.novelService = novelService;
    }
    async generateText(prompt) {
        const apiKey = this.configService.get("GOOGLE_GEMINI_KEY");
        console.log("🔑 Gemini API Key:", apiKey);
        const response = await (0, node_fetch_1.default)(`${this.apiUrl}?key=${apiKey}`, {
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
        if (!text)
            return "";
        return text ?? "";
    }
    async summarizeText(content) {
        const trimmed = content.slice(0, 300);
        const prompt = `다음 글의 핵심 키워드 5개를 콤마로 구분해서 추출해줘. 다른 말은 하지 말고, 키워드만 출력해:\n\n${trimmed}`;
        return this.generateText(prompt);
    }
    async getImageFromUnsplash(summary) {
        const keywords = summary
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean);
        const query = keywords.slice(0, 3).join(" ");
        console.log("🔍 이미지 검색 쿼리:", query);
        const accessKey = this.configService.get("UNSPLASH_ACCESS_KEY");
        console.log("🔐 Unsplash Access Key:", accessKey);
        const res = await axios_1.default.get("https://api.unsplash.com/photos/random", {
            params: {
                query,
            },
            headers: {
                Authorization: `Client-ID ${accessKey}`,
            },
        });
        console.log("Unsplash 응답:", res.data);
        return res.data.urls?.regular ?? "https://source.unsplash.com/random";
    }
    async createNovelWithAi(content, userId, categoryId, peopleNum, type, title) {
        const summary = await this.summarizeText(content);
        console.log("📄 요약 결과 (이미지 검색용):", summary);
        const imageUrl = await this.getImageFromUnsplash(summary);
        if (!imageUrl) {
            throw new Error("이미지 URL을 가져오지 못했습니다.");
        }
        console.log("📷 가져온 이미지 URL:", imageUrl);
        console.log("💾 저장할 소설 정보:", {
            title,
            content,
            imageUrl,
            userId,
            categoryId,
            peopleNum,
            type,
        });
        try {
            const saved = await this.novelService.create({
                title,
                content,
                imageUrl,
                userId,
                categoryId,
                peopleNum,
                type,
            });
            console.log("📚 DB 저장 결과:", saved);
            return saved;
        }
        catch (error) {
            console.error("DB 저장 중 오류 발생:", error);
            throw new Error("소설 저장에 실패했습니다.");
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        novel_service_1.NovelService])
], AiService);
//# sourceMappingURL=ai.service.js.map