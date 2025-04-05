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
exports.ReportController = void 0;
const common_1 = require("@nestjs/common");
const report_service_1 = require("./report.service");
const report_entity_1 = require("./report.entity");
const swagger_1 = require("@nestjs/swagger");
let ReportController = class ReportController {
    reportService;
    constructor(reportService) {
        this.reportService = reportService;
    }
    async findAll() {
        return this.reportService.findAll();
    }
    async findOne(id) {
        return this.reportService.findOne(id);
    }
    async create(report) {
        return this.reportService.create(report);
    }
    async remove(id) {
        return this.reportService.remove(id);
    }
};
exports.ReportController = ReportController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: "신고 목록 조회",
        description: "등록된 모든 신고를 조회합니다.",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "신고 목록 반환" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({
        summary: "신고 상세 조회",
        description: "특정 ID의 신고 상세 정보를 반환합니다.",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "신고 상세 반환" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "해당 ID의 신고가 존재하지 않음" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: "신고 생성",
        description: "신고 정보를 생성합니다.",
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "신고 생성 완료" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_entity_1.Report]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiOperation)({
        summary: "신고 삭제",
        description: "특정 ID의 신고를 삭제합니다.",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "신고 삭제 완료" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "remove", null);
exports.ReportController = ReportController = __decorate([
    (0, swagger_1.ApiTags)("Reports"),
    (0, common_1.Controller)("reports"),
    __metadata("design:paramtypes", [report_service_1.ReportService])
], ReportController);
//# sourceMappingURL=report.controller.js.map