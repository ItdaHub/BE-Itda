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
let LikeController = class LikeController {
    likeService;
    constructor(likeService) {
        this.likeService = likeService;
    }
    async likeNovel(userId, novelId) {
        return this.likeService.likeNovel(userId, novelId);
    }
    async unlikeNovel(userId, novelId) {
        return this.likeService.unlikeNovel(userId, novelId);
    }
    async likeComment(userId, commentId) {
        return this.likeService.likeComment(userId, commentId);
    }
    async unlikeComment(userId, commentId) {
        return this.likeService.unlikeComment(userId, commentId);
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
    (0, common_1.Post)("novel/:userId/:novelId"),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Param)("novelId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "likeNovel", null);
__decorate([
    (0, common_1.Delete)("novel/:userId/:novelId"),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Param)("novelId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "unlikeNovel", null);
__decorate([
    (0, common_1.Post)("comment/:userId/:commentId"),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Param)("commentId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "likeComment", null);
__decorate([
    (0, common_1.Delete)("comment/:userId/:commentId"),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Param)("commentId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "unlikeComment", null);
__decorate([
    (0, common_1.Get)("novel/:novelId/count"),
    __param(0, (0, common_1.Param)("novelId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "countNovelLikes", null);
__decorate([
    (0, common_1.Get)("comment/:commentId/count"),
    __param(0, (0, common_1.Param)("commentId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "countCommentLikes", null);
exports.LikeController = LikeController = __decorate([
    (0, common_1.Controller)("likes"),
    __metadata("design:paramtypes", [like_service_1.LikeService])
], LikeController);
//# sourceMappingURL=like.controller.js.map