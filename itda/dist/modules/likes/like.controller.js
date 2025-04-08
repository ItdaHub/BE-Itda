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
exports.LikeController = void 0;
const common_1 = require("@nestjs/common");
const like_service_1 = require("./like.service");
const jwtauth_guard_1 = require("../auth/jwtauth.guard");
const swagger_1 = require("@nestjs/swagger");
let LikeController = class LikeController {
    likeService;
    constructor(likeService) {
        this.likeService = likeService;
    }
    async toggleNovelLike(req, novelId) {
        return this.likeService.toggleNovelLike(req.user.id, novelId);
    }
    async toggleCommentLike(req, commentId) {
        return this.likeService.toggleCommentLike(req.user.id, commentId);
    }
    async getMyLikes(req) {
        return this.likeService.findLikedNovels(req.user.id);
    }
    async countNovelLikes(novelId) {
        return this.likeService.countNovelLikes(novelId);
    }
    async countCommentLikes(commentId) {
        return this.likeService.countCommentLikes(commentId);
    }
};
exports.LikeController = LikeController;
__decorate([
    (0, common_1.Patch)("novel/:novelId/toggle"),
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "소설 좋아요 토글 (추가/취소)" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("novelId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "toggleNovelLike", null);
__decorate([
    (0, common_1.Patch)("comment/:commentId/toggle"),
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "댓글 좋아요 토글 (추가/취소)" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("commentId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "toggleCommentLike", null);
__decorate([
    (0, common_1.Get)("my-likes"),
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "내가 찜한 소설 목록 조회" }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "getMyLikes", null);
__decorate([
    (0, common_1.Get)("novel/:novelId/count"),
    (0, swagger_1.ApiOperation)({ summary: "소설 좋아요 수 조회" }),
    __param(0, (0, common_1.Param)("novelId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "countNovelLikes", null);
__decorate([
    (0, common_1.Get)("comment/:commentId/count"),
    (0, swagger_1.ApiOperation)({ summary: "댓글 좋아요 수 조회" }),
    __param(0, (0, common_1.Param)("commentId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "countCommentLikes", null);
exports.LikeController = LikeController = __decorate([
    (0, swagger_1.ApiTags)("Like (좋아요 / 찜)"),
    (0, common_1.Controller)("likes"),
    __metadata("design:paramtypes", [like_service_1.LikeService])
], LikeController);
//# sourceMappingURL=like.controller.js.map