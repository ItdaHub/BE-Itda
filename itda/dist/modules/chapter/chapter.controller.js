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
const chapterlistitem_dto_1 = require("./dto/chapterlistitem.dto");
const chaptercontent_dto_1 = require("./dto/chaptercontent.dto");
const participationcheckresponse_dto_1 = require("./dto/participationcheckresponse.dto");
let ChapterController = class ChapterController {
    chapterService;
    constructor(chapterService) {
        this.chapterService = chapterService;
    }
    async getChaptersByNovel(novelId) {
        return this.chapterService.getChaptersByNovel(novelId);
    }
    async getChapterContent(novelId, chapterId) {
        return this.chapterService.getChapterContent(novelId, chapterId);
    }
    async createChapter(novelId, createChapterDto, req) {
        const user = req.user;
        const { content, chapterNumber } = createChapterDto;
        console.log("createChapter 호출됨");
        console.log("소설 ID:", novelId);
        console.log("받은 데이터:", createChapterDto);
        console.log("요청한 사용자:", user);
        return this.chapterService.createChapter(novelId, content, user, chapterNumber);
    }
    async hasUserParticipated(novelId, userId) {
        return {
            hasParticipated: await this.chapterService.hasUserParticipatedInNovel(novelId, userId),
        };
    }
    async getIsPaidChapter(novelId, chapterId) {
        const isPaid = await this.chapterService.checkIsPaid(novelId, chapterId);
        return { isPaid };
    }
};
exports.ChapterController = ChapterController;
__decorate([
    (0, common_1.Get)(":novelId"),
    (0, swagger_1.ApiOperation)({ summary: "소설의 챕터 목록 조회" }),
    (0, swagger_1.ApiParam)({ name: "novelId", type: Number }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "챕터 목록 조회 성공",
        type: chapterlistitem_dto_1.ChapterListItemDto,
        isArray: true,
    }),
    __param(0, (0, common_1.Param)("novelId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChapterController.prototype, "getChaptersByNovel", null);
__decorate([
    (0, common_1.Get)("content/:novelId/:chapterId"),
    (0, swagger_1.ApiOperation)({ summary: "챕터 본문(슬라이드 콘텐츠) 조회" }),
    (0, swagger_1.ApiParam)({ name: "novelId", type: Number }),
    (0, swagger_1.ApiParam)({ name: "chapterId", type: Number }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "챕터 본문 조회 성공",
        type: chaptercontent_dto_1.ChapterContentDto,
    }),
    __param(0, (0, common_1.Param)("novelId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)("chapterId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ChapterController.prototype, "getChapterContent", null);
__decorate([
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, common_1.Post)("write/:novelId"),
    (0, swagger_1.ApiOperation)({
        summary: "소설에 이어쓰기 등록",
        description: "소설 ID에 해당하는 챕터를 새로 등록합니다 (이어쓰기).",
    }),
    (0, swagger_1.ApiParam)({ name: "novelId", type: Number }),
    (0, swagger_1.ApiBody)({ type: createchapter_dto_1.CreateChapterDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "챕터 등록 성공" }),
    __param(0, (0, common_1.Param)("novelId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, createchapter_dto_1.CreateChapterDto, Object]),
    __metadata("design:returntype", Promise)
], ChapterController.prototype, "createChapter", null);
__decorate([
    (0, common_1.Get)("participation/:novelId"),
    (0, swagger_1.ApiOperation)({ summary: "유저가 소설에 이어쓴 기록이 있는지 확인" }),
    (0, swagger_1.ApiParam)({ name: "novelId", type: Number }),
    (0, swagger_1.ApiQuery)({ name: "userId", required: true, type: Number }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "참여 여부 조회 성공",
        type: participationcheckresponse_dto_1.ParticipationCheckResponseDto,
    }),
    __param(0, (0, common_1.Param)("novelId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("userId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ChapterController.prototype, "hasUserParticipated", null);
__decorate([
    (0, common_1.Get)(":novelId/popcorn"),
    (0, swagger_1.ApiOperation)({ summary: "챕터 유료 여부 조회" }),
    __param(0, (0, common_1.Param)("novelId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("chapterId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ChapterController.prototype, "getIsPaidChapter", null);
exports.ChapterController = ChapterController = __decorate([
    (0, swagger_1.ApiTags)("Chapters"),
    (0, common_1.Controller)("chapters"),
    __metadata("design:paramtypes", [chapter_service_1.ChapterService])
], ChapterController);
//# sourceMappingURL=chapter.controller.js.map