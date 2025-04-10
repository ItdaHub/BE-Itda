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
exports.CommentsController = void 0;
const common_1 = require("@nestjs/common");
const comment_service_1 = require("./comment.service");
const jwtauth_guard_1 = require("../auth/jwtauth.guard");
const swagger_1 = require("@nestjs/swagger");
let CommentsController = class CommentsController {
    commentsService;
    constructor(commentsService) {
        this.commentsService = commentsService;
    }
    async create(body) {
        const { userId, content, novelId, chapterId, parentId } = body;
        return this.commentsService.createComment({
            userId,
            content,
            novelId,
            chapterId,
            parentId,
        });
    }
    async getComments(req, novelId, chapterId, userId) {
        const loginUserId = req.user?.id;
        console.log("현재 유저:", req.user);
        return this.commentsService.getComments(novelId, chapterId, loginUserId);
    }
    async deleteComment(id) {
        return this.commentsService.deleteComment(id);
    }
    async reportComment(commentId, userId, reason) {
        return this.commentsService.reportComment(commentId, userId, reason);
    }
    async getMyComments(req) {
        const userId = req.user.id;
        return this.commentsService.findByUser(userId);
    }
};
exports.CommentsController = CommentsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: "댓글 생성",
        description: "소설/챕터에 댓글 또는 대댓글을 작성합니다.",
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "댓글 작성 성공" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(":novelId"),
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: "댓글 목록 조회 (좋아요 여부 포함)",
        description: "소설 ID를 기준으로 댓글을 조회하며, 챕터 ID나 유저 ID로 필터링할 수 있습니다. 로그인한 유저가 좋아요 누른 댓글은 isLiked=true로 표시됩니다.",
    }),
    (0, swagger_1.ApiParam)({ name: "novelId", type: Number, description: "소설 ID" }),
    (0, swagger_1.ApiQuery)({
        name: "chapterId",
        required: false,
        type: Number,
        description: "챕터 ID",
    }),
    (0, swagger_1.ApiQuery)({
        name: "userId",
        required: false,
        type: Number,
        description: "작성자 ID",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "댓글 목록 반환 성공" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("novelId")),
    __param(2, (0, common_1.Query)("chapterId")),
    __param(3, (0, common_1.Query)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, Number]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "getComments", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiOperation)({
        summary: "댓글 삭제",
        description: "댓글 ID를 통해 해당 댓글을 삭제합니다.",
    }),
    (0, swagger_1.ApiParam)({ name: "id", type: Number, description: "댓글 ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "댓글 삭제 성공" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "deleteComment", null);
__decorate([
    (0, common_1.Post)("/declare/:id"),
    (0, swagger_1.ApiOperation)({
        summary: "댓글 신고",
        description: "댓글 ID와 신고 사유를 제출하여 해당 댓글을 신고합니다.",
    }),
    (0, swagger_1.ApiParam)({ name: "id", type: Number, description: "댓글 ID" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "댓글 신고 접수 완료" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("userId")),
    __param(2, (0, common_1.Body)("reason")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "reportComment", null);
__decorate([
    (0, common_1.Get)("my-comments"),
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: "내 댓글 조회",
        description: "JWT 토큰 기반으로 로그인한 유저의 댓글을 반환합니다.",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "내 댓글 목록 반환 성공" }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "getMyComments", null);
exports.CommentsController = CommentsController = __decorate([
    (0, swagger_1.ApiTags)("Comments"),
    (0, common_1.Controller)("comments"),
    __metadata("design:paramtypes", [comment_service_1.CommentsService])
], CommentsController);
//# sourceMappingURL=comment.controller.js.map