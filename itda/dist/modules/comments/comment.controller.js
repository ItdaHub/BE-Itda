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
const createcomment_dto_1 = require("./dto/createcomment.dto");
const deletecomments_dto_1 = require("./dto/deletecomments.dto");
const reportcomment_dto_1 = require("./dto/reportcomment.dto");
let CommentsController = class CommentsController {
    commentsService;
    constructor(commentsService) {
        this.commentsService = commentsService;
    }
    async create(createCommentDto) {
        if (!createCommentDto.novelId && !createCommentDto.chapterId) {
            throw new Error("소설 ID 또는 챕터 ID는 하나는 필요합니다.");
        }
        return this.commentsService.createComment(createCommentDto);
    }
    async getNovelComments(req, novelId) {
        const loginUserId = req.user?.id;
        return this.commentsService.getComments(novelId, undefined, loginUserId);
    }
    async getChapterComments(req, chapterId) {
        const loginUserId = req.user?.id;
        return this.commentsService.getComments(undefined, chapterId, loginUserId);
    }
    async deleteComments(dto) {
        return this.commentsService.deleteComments(dto.ids);
    }
    async deleteComment(id) {
        return this.commentsService.deleteComment(id);
    }
    async reportComment(commentId, dto) {
        return this.commentsService.reportComment(commentId, dto.userId, dto.reason);
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
    (0, swagger_1.ApiBody)({ type: createcomment_dto_1.CreateCommentDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createcomment_dto_1.CreateCommentDto]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)("/novel/:novelId"),
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: "소설 댓글 조회 (좋아요 여부 포함)",
        description: "소설 ID 기준으로 소설 댓글을 조회합니다. 로그인한 유저가 좋아요 누른 댓글은 isLiked=true로 표시됩니다.",
    }),
    (0, swagger_1.ApiParam)({ name: "novelId", type: Number, description: "소설 ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "소설 댓글 목록 반환 성공" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("novelId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "getNovelComments", null);
__decorate([
    (0, common_1.Get)("/chapter/:chapterId"),
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: "챕터 댓글 조회 (좋아요 여부 포함)",
        description: "챕터 ID 기준으로 챕터 댓글을 조회합니다. 로그인한 유저가 좋아요 누른 댓글은 isLiked=true로 표시됩니다.",
    }),
    (0, swagger_1.ApiParam)({ name: "chapterId", type: Number, description: "챕터 ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "챕터 댓글 목록 반환 성공" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("chapterId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "getChapterComments", null);
__decorate([
    (0, common_1.Delete)("/bulk-delete"),
    (0, swagger_1.ApiOperation)({
        summary: "댓글 여러 개 삭제",
        description: "여러 댓글 ID를 통해 해당 댓글들을 삭제합니다.",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "댓글 여러 개 삭제 성공" }),
    (0, swagger_1.ApiBody)({ type: deletecomments_dto_1.DeleteCommentsDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [deletecomments_dto_1.DeleteCommentsDto]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "deleteComments", null);
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
    (0, swagger_1.ApiBody)({ type: reportcomment_dto_1.ReportCommentDto }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, reportcomment_dto_1.ReportCommentDto]),
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