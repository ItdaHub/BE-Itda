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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const jwtauth_guard_1 = require("../auth/jwtauth.guard");
const novel_service_1 = require("../novels/novel.service");
const swagger_1 = require("@nestjs/swagger");
let AdminController = class AdminController {
    novelService;
    constructor(novelService) {
        this.novelService = novelService;
    }
    async getNovelDetail(novelId) {
        return this.novelService.getNovelDetail(novelId);
    }
    async submitNovel(novelId) {
        return this.novelService.submitNovelForCompletion(novelId);
    }
    async getCompletedNovels() {
        return this.novelService.getCompletedNovels();
    }
    async deleteNovel(novelId) {
        return this.novelService.adminDeleteNovel(novelId);
    }
    async publishNovel(novelId) {
        return this.novelService.adminPublishNovel(novelId);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)("novel/:novelId"),
    (0, swagger_1.ApiOperation)({ summary: "소설 상세 정보 가져오기" }),
    (0, swagger_1.ApiParam)({ name: "novelId", type: "number", description: "소설 ID" }),
    __param(0, (0, common_1.Param)("novelId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getNovelDetail", null);
__decorate([
    (0, common_1.Post)("complete/:novelId"),
    (0, swagger_1.ApiOperation)({ summary: "소설 출품 요청 처리 (마지막 참여자 완료 시)" }),
    (0, swagger_1.ApiParam)({ name: "novelId", type: "number", description: "소설 ID" }),
    __param(0, (0, common_1.Param)("novelId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "submitNovel", null);
__decorate([
    (0, common_1.Get)("complete"),
    (0, swagger_1.ApiOperation)({ summary: "출품 대기 중이거나 출품된 소설 목록" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCompletedNovels", null);
__decorate([
    (0, common_1.Delete)("delete/:novelId"),
    (0, swagger_1.ApiOperation)({ summary: "소설 삭제 (관리자 권한)" }),
    (0, swagger_1.ApiParam)({ name: "novelId", type: "number", description: "소설 ID" }),
    __param(0, (0, common_1.Param)("novelId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteNovel", null);
__decorate([
    (0, common_1.Post)("publish/:novelId"),
    (0, swagger_1.ApiOperation)({ summary: "소설 출품 처리 (관리자 권한)" }),
    (0, swagger_1.ApiParam)({ name: "novelId", type: "number", description: "소설 ID" }),
    __param(0, (0, common_1.Param)("novelId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "publishNovel", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)("Admin (관리자)"),
    (0, common_1.Controller)("admin"),
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [novel_service_1.NovelService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map