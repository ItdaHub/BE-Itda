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
const jwtauth_guard_1 = require("../auth/jwtauth.guard");
let ReportController = class ReportController {
    reportService;
    constructor(reportService) {
        this.reportService = reportService;
    }
    async reportComment(commentId, reportData, req) {
        if (!reportData.reason) {
            throw new common_1.BadRequestException("신고 사유를 입력해주세요.");
        }
        const report = new report_entity_1.Report();
        report.reporter = req.user;
        report.target_type = report_entity_1.TargetType.COMMENT;
        report.target_id = commentId;
        report.reason = reportData.reason;
        return this.reportService.create(report);
    }
    async reportChapter(chapterId, reportData, req) {
        if (!reportData.reason) {
            throw new common_1.BadRequestException("신고 사유를 입력해주세요.");
        }
        const report = new report_entity_1.Report();
        report.reporter = req.user;
        report.target_type = report_entity_1.TargetType.CHAPTER;
        report.target_id = chapterId;
        report.reason = reportData.reason;
        return this.reportService.create(report);
    }
    async getAllReports() {
        return this.reportService.findAll();
    }
    async getReportById(id) {
        const report = await this.reportService.findOne(id);
        if (!report) {
            throw new common_1.NotFoundException("해당 신고를 찾을 수 없습니다.");
        }
        return report;
    }
    async deleteReport(id) {
        const success = await this.reportService.delete(id);
        if (!success) {
            throw new common_1.NotFoundException("해당 신고를 찾을 수 없습니다.");
        }
        return { message: "신고가 삭제되었습니다." };
    }
    async handleReport(id) {
        const success = await this.reportService.handleReport(id);
        if (!success) {
            throw new common_1.NotFoundException("해당 신고를 처리할 수 없습니다.");
        }
        return { message: "신고가 처리되었습니다." };
    }
};
exports.ReportController = ReportController;
__decorate([
    (0, common_1.Post)("comments/:commentId"),
    (0, swagger_1.ApiOperation)({ summary: "댓글 신고 생성" }),
    (0, swagger_1.ApiParam)({
        name: "commentId",
        type: "number",
        description: "신고할 댓글 ID",
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                reason: { type: "string", description: "신고 사유" },
            },
            required: ["reason"],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "댓글 신고 완료" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "잘못된 요청" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "해당 댓글을 찾을 수 없음" }),
    __param(0, (0, common_1.Param)("commentId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "reportComment", null);
__decorate([
    (0, common_1.Post)("chapters/:chapterId"),
    (0, swagger_1.ApiOperation)({ summary: "챕터 신고 생성" }),
    (0, swagger_1.ApiParam)({
        name: "chapterId",
        type: "number",
        description: "신고할 챕터 ID",
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                reason: { type: "string", description: "신고 사유" },
            },
            required: ["reason"],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "챕터 신고 완료" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "잘못된 요청" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "해당 챕터를 찾을 수 없음" }),
    __param(0, (0, common_1.Param)("chapterId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "reportChapter", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "모든 신고 목록 조회 (관리자)" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "신고 목록 조회 성공",
        type: [report_entity_1.Report],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getAllReports", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "신고 단건 조회" }),
    (0, swagger_1.ApiParam)({ name: "id", type: "number", description: "조회할 신고 ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "신고 조회 성공", type: report_entity_1.Report }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "해당 신고를 찾을 수 없음" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getReportById", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "신고 삭제 (관리자)" }),
    (0, swagger_1.ApiParam)({ name: "id", type: "number", description: "삭제할 신고 ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "신고 삭제 성공" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "해당 신고를 찾을 수 없음" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "deleteReport", null);
__decorate([
    (0, common_1.Patch)(":id/handle"),
    (0, swagger_1.ApiOperation)({ summary: "신고 처리 (신고자에게 알림 + 신고 횟수 증가)" }),
    (0, swagger_1.ApiParam)({ name: "id", type: "number", description: "처리할 신고 ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "신고 처리 성공" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "handleReport", null);
exports.ReportController = ReportController = __decorate([
    (0, swagger_1.ApiTags)("Reports"),
    (0, common_1.Controller)("reports"),
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [report_service_1.ReportService])
], ReportController);
//# sourceMappingURL=report.controller.js.map