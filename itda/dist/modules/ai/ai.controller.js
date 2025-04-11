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
        const content = await this.aiService.generateNovel(prompt);
        return {
            content,
            genre,
            userId,
        };
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Post)("/generate"),
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: "AI로 소설 생성 (저장 X)" }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ai_dto_1.CreateAiDto, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateWithAI", null);
exports.AiController = AiController = __decorate([
    (0, swagger_1.ApiTags)("AI"),
    (0, common_1.Controller)("ai"),
    __metadata("design:paramtypes", [ai_service_1.AiService,
        novel_service_1.NovelService])
], AiController);
//# sourceMappingURL=ai.controller.js.map