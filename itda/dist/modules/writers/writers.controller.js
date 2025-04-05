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
exports.WritersController = void 0;
const common_1 = require("@nestjs/common");
const writers_service_1 = require("../writers/writers.service");
const swagger_1 = require("@nestjs/swagger");
let WritersController = class WritersController {
    writersService;
    constructor(writersService) {
        this.writersService = writersService;
    }
    async getWriterNickname(chapterId) {
        const nickname = await this.writersService.getNicknameByChapterId(chapterId);
        return { nickname };
    }
};
exports.WritersController = WritersController;
__decorate([
    (0, common_1.Get)(":chapterId"),
    (0, swagger_1.ApiOperation)({ summary: "챕터 ID로 작성자 닉네임 조회" }),
    (0, swagger_1.ApiParam)({
        name: "chapterId",
        description: "조회할 챕터 ID",
        type: Number,
    }),
    __param(0, (0, common_1.Param)("chapterId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], WritersController.prototype, "getWriterNickname", null);
exports.WritersController = WritersController = __decorate([
    (0, swagger_1.ApiTags)("Writers (작성자)"),
    (0, common_1.Controller)("writers"),
    __metadata("design:paramtypes", [writers_service_1.WritersService])
], WritersController);
//# sourceMappingURL=writers.controller.js.map