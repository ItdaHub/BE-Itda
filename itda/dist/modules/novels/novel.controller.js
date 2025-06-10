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
exports.NovelController = void 0;
const common_1 = require("@nestjs/common");
const jwtauth_guard_1 = require("../auth/jwtauth.guard");
const optionaljwt_guard_1 = require("../auth/optionaljwt.guard");
const novel_service_1 = require("./novel.service");
const recentNovel_service_1 = require("./recentNovel.service");
const createnovel_dto_1 = require("./dto/createnovel.dto");
const addchapter_dto_1 = require("./dto/addchapter.dto");
const recentNovel_dto_1 = require("./dto/recentNovel.dto");
const swagger_1 = require("@nestjs/swagger");
let NovelController = class NovelController {
    novelService;
    recentNovelService;
    constructor(novelService, recentNovelService) {
        this.novelService = novelService;
        this.recentNovelService = recentNovelService;
    }
    async getAllNovels() {
        return this.novelService.getAllNovels();
    }
    async getPublishedNovels() {
        return this.novelService.getPublishedNovels();
    }
    async getFilteredNovels(type, genre, age) {
        return this.novelService.getFilteredNovels(type, genre, age);
    }
    async searchNovelsByTitle(query) {
        if (!query || query.trim() === "") {
            throw new common_1.BadRequestException("검색어가 비어있습니다.");
        }
        return this.novelService.searchNovelsByTitle(query);
    }
    async getRanking(age) {
        if (age !== undefined) {
            const parsedAge = parseInt(age, 10);
            if (isNaN(parsedAge)) {
                throw new common_1.BadRequestException("잘못된 연령대입니다.");
            }
            return this.novelService.getRankedNovelsByAge(parsedAge);
        }
        return this.novelService.getRankedNovels();
    }
    getMyNovels(req) {
        const userId = req.user.id;
        return this.novelService.findMyNovels(userId);
    }
    async createNovel(dto, req) {
        const userId = req.user.id;
        return this.novelService.create({ ...dto, userId });
    }
    async getChapters(novelId) {
        return this.novelService.getChapters(parseInt(novelId, 10));
    }
    async addChapter(novelId, dto, req) {
        const userId = req.user.id;
        return this.novelService.addChapter(parseInt(novelId, 10), {
            ...dto,
            userId,
        });
    }
    async getParticipants(novelId) {
        return this.novelService.getParticipants(parseInt(novelId, 10));
    }
    async getNovelDetail(id, req) {
        const userId = req.user?.id ?? null;
        return this.novelService.getNovelDetail(id, userId);
    }
    async submitNovel(id) {
        return this.novelService.submitNovelForCompletion(id);
    }
    async addRecent(novelId, chapterNumber, req) {
        return this.recentNovelService.addRecentNovel(req.user, novelId, chapterNumber);
    }
    async getRecent(req) {
        console.log("📌 req.user:", req.user);
        const recent = await this.recentNovelService.getRecentNovels(req.user);
        return recent.map((item) => new recentNovel_dto_1.RecentNovelDto(item));
    }
};
exports.NovelController = NovelController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "전체 소설 목록 가져오기" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NovelController.prototype, "getAllNovels", null);
__decorate([
    (0, common_1.Get)("/published"),
    (0, swagger_1.ApiOperation)({ summary: "출품된 소설 목록 가져오기" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NovelController.prototype, "getPublishedNovels", null);
__decorate([
    (0, common_1.Get)("/filter"),
    (0, swagger_1.ApiOperation)({ summary: "소설 필터링 조회" }),
    __param(0, (0, common_1.Query)("type")),
    __param(1, (0, common_1.Query)("genre")),
    __param(2, (0, common_1.Query)("age")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], NovelController.prototype, "getFilteredNovels", null);
__decorate([
    (0, common_1.Get)("/search"),
    (0, swagger_1.ApiOperation)({ summary: "소설 검색 (제목 기준)" }),
    (0, swagger_1.ApiQuery)({ name: "query", description: "검색어 (소설 제목 일부 또는 전체)" }),
    __param(0, (0, common_1.Query)("query")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NovelController.prototype, "searchNovelsByTitle", null);
__decorate([
    (0, common_1.Get)("/rankings"),
    (0, swagger_1.ApiOperation)({ summary: "통합 또는 연령대별 소설 랭킹" }),
    (0, swagger_1.ApiQuery)({ name: "age", required: false, description: "연령대 (예: 20)" }),
    __param(0, (0, common_1.Query)("age")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NovelController.prototype, "getRanking", null);
__decorate([
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("/my"),
    (0, swagger_1.ApiOperation)({ summary: "내가 쓴 소설 목록 조회" }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NovelController.prototype, "getMyNovels", null);
__decorate([
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "소설 처음 작성 (첫 Chapter 포함)" }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createnovel_dto_1.CreateNovelDto, Object]),
    __metadata("design:returntype", Promise)
], NovelController.prototype, "createNovel", null);
__decorate([
    (0, common_1.UseGuards)(optionaljwt_guard_1.OptionalJwtAuthGuard),
    (0, common_1.Get)(":id/chapters"),
    (0, swagger_1.ApiOperation)({ summary: "소설의 챕터 목록 조회" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "소설 ID" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NovelController.prototype, "getChapters", null);
__decorate([
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(":id/chapters"),
    (0, swagger_1.ApiOperation)({ summary: "소설에 이어쓰기 (챕터 추가)" }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: "id", description: "소설 ID" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, addchapter_dto_1.AddChapterDto, Object]),
    __metadata("design:returntype", Promise)
], NovelController.prototype, "addChapter", null);
__decorate([
    (0, common_1.Get)(":id/participants"),
    (0, swagger_1.ApiOperation)({ summary: "소설에 참여한 사용자 목록 조회" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "소설 ID" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NovelController.prototype, "getParticipants", null);
__decorate([
    (0, common_1.UseGuards)(optionaljwt_guard_1.OptionalJwtAuthGuard),
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "소설 상세 조회 (비회원도 접근 가능)" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "소설 ID" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], NovelController.prototype, "getNovelDetail", null);
__decorate([
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(":id/submit"),
    (0, swagger_1.ApiOperation)({ summary: "소설 출품 요청" }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: "id", description: "소설 ID" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NovelController.prototype, "submitNovel", null);
__decorate([
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, common_1.Post)("recent/:novelId/:chapterNumber"),
    (0, swagger_1.ApiOperation)({ summary: "최근 본 소설 추가" }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)("novelId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)("chapterNumber", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], NovelController.prototype, "addRecent", null);
__decorate([
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("recent"),
    (0, swagger_1.ApiOperation)({ summary: "최근 본 소설 목록 조회" }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NovelController.prototype, "getRecent", null);
exports.NovelController = NovelController = __decorate([
    (0, swagger_1.ApiTags)("Novel (소설)"),
    (0, common_1.Controller)("novels"),
    __metadata("design:paramtypes", [novel_service_1.NovelService,
        recentNovel_service_1.RecentNovelService])
], NovelController);
//# sourceMappingURL=novel.controller.js.map