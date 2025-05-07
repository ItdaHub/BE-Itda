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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("./ai.service");
const jwtauth_guard_1 = require("../auth/jwtauth.guard");
const novel_service_1 = require("../novels/novel.service");
const swagger_1 = require("@nestjs/swagger");
const create_ai_dto_1 = require("./dto/create-ai.dto");
let AiController = class AiController {
    aiService;
    novelService;
    constructor(aiService, novelService) {
        this.aiService = aiService;
        this.novelService = novelService;
    }
    async generateWithAI(body, req) {
        const { prompt, genre } = body;
        const userId = req.user.id;
        const content = await this.aiService.generateText(prompt);
        return {
            content,
            genre,
            userId,
        };
    }
    async summarize(content) {
        return this.aiService.summarizeText(content);
    }
    async saveUserWrittenNovelWithAiData(body, req) {
        const { title, content, categoryId, peopleNum, type } = body;
        return this.aiService.createNovelWithAi(content, req.user.id, categoryId, peopleNum, type, title);
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Post)("/generate"),
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: "AI로 소설 생성 (저장되지 않음)",
        description: "Gemini를 이용해 프롬프트 기반 소설을 생성합니다.",
    }),
    (0, swagger_1.ApiBody)({ type: create_ai_dto_1.CreateAiDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "소설 본문 문자열 반환" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ai_dto_1.CreateAiDto, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateWithAI", null);
__decorate([
    (0, common_1.Post)("summarize"),
    (0, swagger_1.ApiOperation)({
        summary: "소설 본문 요약",
        description: "본문 내용을 요약합니다.",
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                content: { type: "string", example: "긴 소설 본문 내용..." },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "요약된 텍스트 반환" }),
    __param(0, (0, common_1.Body)("content")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "summarize", null);
__decorate([
    (0, common_1.Post)("user-write-save"),
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: "유저 작성 소설 저장 (요약+이미지 생성 포함)",
        description: "유저가 직접 작성한 소설을 저장하며, AI가 요약과 이미지를 생성합니다.",
    }),
    (0, swagger_1.ApiBody)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "소설 저장 성공 응답" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "saveUserWrittenNovelWithAiData", null);
exports.AiController = AiController = __decorate([
    (0, swagger_1.ApiTags)("AI"),
    (0, common_1.Controller)("ai"),
    __metadata("design:paramtypes", [ai_service_1.AiService,
        novel_service_1.NovelService])
], AiController);
//# sourceMappingURL=ai.controller.js.map