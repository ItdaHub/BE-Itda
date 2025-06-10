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
exports.PointController = void 0;
const common_1 = require("@nestjs/common");
const point_service_1 = require("./point.service");
const point_entity_1 = require("./entities/point.entity");
const usepopcorn_dto_1 = require("./dto/usepopcorn.dto");
const swagger_1 = require("@nestjs/swagger");
let PointController = class PointController {
    pointService;
    constructor(pointService) {
        this.pointService = pointService;
    }
    async usePopcorn(usePopcornDto) {
        return this.pointService.spendPoints(usePopcornDto);
    }
    async getUserPoints(userId) {
        const total = await this.pointService.getUserTotalPoints(userId);
        return { total };
    }
    async getChargeHistory(userId) {
        return this.pointService.getUserHistory(userId, point_entity_1.PointType.EARN);
    }
    async getUseHistory(userId) {
        return this.pointService.getUserHistory(userId, point_entity_1.PointType.SPEND);
    }
    async getPurchasedChapters(userId, novelId) {
        return this.pointService.getPurchasedChapters(userId, novelId);
    }
};
exports.PointController = PointController;
__decorate([
    (0, common_1.Post)("use"),
    (0, swagger_1.ApiOperation)({
        summary: "팝콘 사용",
        description: "팝콘을 사용하여 회차를 구매합니다.",
    }),
    (0, swagger_1.ApiBody)({ type: usepopcorn_dto_1.UsePopcornDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "팝콘 사용 성공" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [usepopcorn_dto_1.UsePopcornDto]),
    __metadata("design:returntype", Promise)
], PointController.prototype, "usePopcorn", null);
__decorate([
    (0, common_1.Get)(":userId"),
    (0, swagger_1.ApiOperation)({
        summary: "사용자 팝콘 보유량 조회",
        description: "사용자의 총 팝콘 보유량을 조회합니다.",
    }),
    (0, swagger_1.ApiParam)({ name: "userId", type: Number, description: "사용자 ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "보유 팝콘 수 반환" }),
    __param(0, (0, common_1.Param)("userId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PointController.prototype, "getUserPoints", null);
__decorate([
    (0, common_1.Get)("charge/:userId"),
    (0, swagger_1.ApiOperation)({
        summary: "팝콘 충전 내역",
        description: "사용자의 팝콘 충전 내역을 조회합니다.",
    }),
    (0, swagger_1.ApiParam)({ name: "userId", type: Number, description: "사용자 ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "충전 내역 반환" }),
    __param(0, (0, common_1.Param)("userId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PointController.prototype, "getChargeHistory", null);
__decorate([
    (0, common_1.Get)("use/:userId"),
    (0, swagger_1.ApiOperation)({
        summary: "팝콘 사용 내역",
        description: "사용자의 팝콘 사용 내역을 조회합니다.",
    }),
    (0, swagger_1.ApiParam)({ name: "userId", type: Number, description: "사용자 ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "사용 내역 반환" }),
    __param(0, (0, common_1.Param)("userId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PointController.prototype, "getUseHistory", null);
__decorate([
    (0, common_1.Get)("purchases/:userId"),
    (0, swagger_1.ApiOperation)({
        summary: "구매한 회차 조회",
        description: "특정 소설에서 사용자가 구매한 회차 목록을 조회합니다.",
    }),
    (0, swagger_1.ApiParam)({ name: "userId", type: Number, description: "사용자 ID" }),
    (0, swagger_1.ApiQuery)({ name: "novelId", type: Number, description: "소설 ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "구매한 회차 목록 반환" }),
    __param(0, (0, common_1.Param)("userId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("novelId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PointController.prototype, "getPurchasedChapters", null);
exports.PointController = PointController = __decorate([
    (0, swagger_1.ApiTags)("Popcorn (Point)"),
    (0, common_1.Controller)("popcorn"),
    __metadata("design:paramtypes", [point_service_1.PointService])
], PointController);
//# sourceMappingURL=point.controller.js.map