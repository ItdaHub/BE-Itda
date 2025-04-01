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
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InteractionsController.prototype, "createVote", null);
__decorate([
    (0, common_1.Post)("comment"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InteractionsController.prototype, "createComment", null);
__decorate([
    (0, common_1.Get)("comments/:novelId"),
    __param(0, (0, common_1.Param)("novelId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InteractionsController.prototype, "getCommentsByNovel", null);
__decorate([
    (0, common_1.Delete)("comment/:commentId"),
    __param(0, (0, common_1.Param)("commentId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InteractionsController.prototype, "deleteComment", null);
exports.InteractionsController = InteractionsController = __decorate([
    (0, common_1.Controller)("interactions"),
    __metadata("design:paramtypes", [interaction_service_1.InteractionsService])
], InteractionsController);
//# sourceMappingURL=interaction.controller.js.map