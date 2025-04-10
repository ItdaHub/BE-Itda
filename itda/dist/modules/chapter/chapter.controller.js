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
exports.ChapterController = void 0;
const common_1 = require("@nestjs/common");
const chapter_service_1 = require("./chapter.service");
const swagger_1 = require("@nestjs/swagger");
const jwtauth_guard_1 = require("../auth/jwtauth.guard");
const createchapter_dto_1 = require("./dto/createchapter.dto");
let ChapterController = class ChapterController {
    chapterService;
    constructor(chapterService) {
        this.chapterService = chapterService;
    }
    async getChaptersByNovel(novelId) {
        return this.chapterService.getChaptersByNovel(novelId);
    }
    async getChapterContent(chapterId) {
        return this.chapterService.getChapterContent(chapterId);
    }
    async createChapter(novelId, createChapterDto, req) {
        const user = req.user;
        return this.chapterService.createChapter(novelId, createChapterDto.content, user);
    }
};
exports.ChapterController = ChapterController;
__decorate([
    (0, common_1.Get)(":novelId"),
    (0, swagger_1.ApiOperation)({ summary: "소설의 챕터 목록 조회" }),
    (0, swagger_1.ApiParam)({ name: "novelId", type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "챕터 목록 반환 성공" }),
    __param(0, (0, common_1.Param)("novelId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChapterController.prototype, "getChaptersByNovel", null);
__decorate([
    (0, common_1.Get)("content/:chapterId"),
    (0, swagger_1.ApiOperation)({ summary: "챕터 본문(슬라이드 콘텐츠) 조회" }),
    (0, swagger_1.ApiParam)({ name: "chapterId", type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "챕터 콘텐츠 반환 성공" }),
    __param(0, (0, common_1.Param)("chapterId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChapterController.prototype, "getChapterContent", null);
__decorate([
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, common_1.Post)("write/:novelId"),
    (0, swagger_1.ApiOperation)({
        summary: "소설에 이어쓰기 등록",
        description: "소설 ID에 해당하는 챕터를 새로 등록합니다 (이어쓰기).",
    }),
    (0, swagger_1.ApiParam)({ name: "novelId", type: Number, description: "소설 ID" }),
    (0, swagger_1.ApiBody)({ type: createchapter_dto_1.CreateChapterDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "챕터 등록 성공" }),
    __param(0, (0, common_1.Param)("novelId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, createchapter_dto_1.CreateChapterDto, Object]),
    __metadata("design:returntype", Promise)
], ChapterController.prototype, "createChapter", null);
exports.ChapterController = ChapterController = __decorate([
    (0, swagger_1.ApiTags)("Chapters"),
    (0, common_1.Controller)("chapters"),
    __metadata("design:paramtypes", [chapter_service_1.ChapterService])
], ChapterController);
//# sourceMappingURL=chapter.controller.js.map