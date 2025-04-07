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
exports.InteractionsController = void 0;
const common_1 = require("@nestjs/common");
const interaction_service_1 = require("./interaction.service");
const swagger_1 = require("@nestjs/swagger");
let InteractionsController = class InteractionsController {
    interactionsService;
    constructor(interactionsService) {
        this.interactionsService = interactionsService;
    }
    createVote(createVoteDto) {
        return this.interactionsService.createVote(createVoteDto);
    }
    createComment(createCommentDto) {
        return this.interactionsService.createComment(createCommentDto);
    }
    getCommentsByNovel(novelId) {
        return this.interactionsService.getCommentsByNovel(novelId);
    }
    deleteComment(commentId) {
        return this.interactionsService.deleteComment(commentId);
    }
};
exports.InteractionsController = InteractionsController;
__decorate([
    (0, common_1.Post)("vote"),
    (0, swagger_1.ApiOperation)({
        summary: "소설 찬반 투표",
        description: "소설에 대해 '찬성' 또는 '반대' 투표를 생성합니다.",
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "투표 생성 성공" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InteractionsController.prototype, "createVote", null);
__decorate([
    (0, common_1.Post)("comment"),
    (0, swagger_1.ApiOperation)({
        summary: "댓글 작성",
        description: "소설 또는 특정 챕터에 댓글을 작성합니다. parentCommentId를 포함하면 대댓글로 등록됩니다.",
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "댓글 생성 성공" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InteractionsController.prototype, "createComment", null);
__decorate([
    (0, common_1.Get)("comments/:novelId"),
    (0, swagger_1.ApiOperation)({
        summary: "소설 댓글 조회",
        description: "특정 소설에 등록된 모든 댓글을 조회합니다.",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "댓글 목록 반환" }),
    __param(0, (0, common_1.Param)("novelId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InteractionsController.prototype, "getCommentsByNovel", null);
__decorate([
    (0, common_1.Delete)("comment/:commentId"),
    (0, swagger_1.ApiOperation)({
        summary: "댓글 삭제",
        description: "특정 댓글을 삭제합니다.",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "댓글 삭제 성공" }),
    __param(0, (0, common_1.Param)("commentId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InteractionsController.prototype, "deleteComment", null);
exports.InteractionsController = InteractionsController = __decorate([
    (0, swagger_1.ApiTags)("Interactions"),
    (0, common_1.Controller)("interactions"),
    __metadata("design:paramtypes", [interaction_service_1.InteractionsService])
], InteractionsController);
//# sourceMappingURL=interaction.controller.js.map