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
exports.ReportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const report_entity_1 = require("./entities/report.entity");
const comment_entity_1 = require("../comments/entities/comment.entity");
const chapter_entity_1 = require("../chapter/entities/chapter.entity");
const user_entity_1 = require("../users/entities/user.entity");
const user_service_1 = require("../users/user.service");
const notification_service_1 = require("../notifications/notification.service");
let ReportService = class ReportService {
    reportRepository;
    commentRepository;
    chapterRepository;
    userService;
    notificationService;
    constructor(reportRepository, commentRepository, chapterRepository, userService, notificationService) {
        this.reportRepository = reportRepository;
        this.commentRepository = commentRepository;
        this.chapterRepository = chapterRepository;
        this.userService = userService;
        this.notificationService = notificationService;
    }
    async findAll() {
        return this.reportRepository.find({
            where: { handled: false },
            relations: ["reporter"],
            order: { created_at: "DESC" },
        });
    }
    async findOne(id) {
        const report = await this.reportRepository.findOne({
            where: { id },
            relations: ["reporter"],
        });
        if (!report) {
            throw new common_1.NotFoundException(`Report with ID ${id} not found`);
        }
        if (report.target_type === report_entity_1.TargetType.CHAPTER) {
            const chapter = await this.chapterRepository.findOne({
                where: { id: report.target_id },
            });
            if (!chapter) {
                throw new common_1.NotFoundException(`Chapter not found for ID ${report.target_id}`);
            }
        }
        if (report.target_type === report_entity_1.TargetType.COMMENT) {
            const comment = await this.commentRepository.findOne({
                where: { id: report.target_id },
            });
            if (!comment) {
                throw new common_1.NotFoundException(`Comment not found for ID ${report.target_id}`);
            }
        }
        return report;
    }
    async create(report) {
        const existingReport = await this.reportRepository.findOne({
            where: {
                reporter: report.reporter,
                target_id: report.target_id,
                target_type: report.target_type,
            },
        });
        if (existingReport) {
            throw new common_1.BadRequestException("이미 해당 콘텐츠에 대해 신고한 이력이 있습니다.");
        }
        if (report.target_type === report_entity_1.TargetType.COMMENT) {
            const comment = await this.commentRepository.findOne({
                where: { id: report.target_id },
                relations: ["user"],
            });
            if (!comment)
                throw new common_1.NotFoundException("댓글을 찾을 수 없습니다.");
            report.reported_content = comment.content;
            report.reported_user_id = comment.user?.id;
        }
        else if (report.target_type === report_entity_1.TargetType.CHAPTER) {
            const chapter = await this.chapterRepository.findOne({
                where: { id: report.target_id },
                relations: ["author", "novel"],
            });
            if (!chapter)
                throw new common_1.NotFoundException("챕터를 찾을 수 없습니다.");
            report.chapter = chapter;
            report.reported_content = `[${chapter.novel.title} - ${chapter.chapter_number}화]\n${chapter.content}`;
            report.reported_user_id = chapter.author?.id;
        }
        return this.reportRepository.save(report);
    }
    async delete(id) {
        const report = await this.reportRepository.findOne({ where: { id } });
        if (!report) {
            throw new common_1.NotFoundException(`Report with ID ${id} not found`);
        }
        await this.reportRepository.remove(report);
        return true;
    }
    async findReportedUser(report) {
        if (report.target_type === report_entity_1.TargetType.COMMENT) {
            const comment = await this.commentRepository.findOne({
                where: { id: report.target_id },
                relations: ["user"],
            });
            return comment?.user ?? null;
        }
        if (report.target_type === report_entity_1.TargetType.CHAPTER) {
            const chapter = await this.chapterRepository.findOne({
                where: { id: report.target_id },
                relations: ["author"],
            });
            return chapter?.author ?? null;
        }
        return null;
    }
    async handleReport(reportId) {
        console.log(`🛠️ 신고 ID: ${reportId} 처리 시작`);
        const report = await this.findOne(reportId);
        if (!report) {
            console.log(`❌ 신고 ID ${reportId}를 찾을 수 없습니다`);
            return false;
        }
        console.log(`📄 신고 데이터:`, report);
        const reportedUser = await this.findReportedUser(report);
        if (!reportedUser) {
            console.log(`❌ 신고 대상 유저를 찾을 수 없습니다`);
            return false;
        }
        console.log(`👤 신고 대상 유저: ${reportedUser.nickname} (ID: ${reportedUser.id})`);
        reportedUser.report_count = (reportedUser.report_count || 0) + 1;
        console.log(`⚠️ 신고 횟수: ${reportedUser.report_count}`);
        if (reportedUser.report_count >= 2) {
            reportedUser.status = user_entity_1.UserStatus.STOP;
            console.log(`🚫 유저 상태 STOP으로 변경됨`);
        }
        await this.userService.save(reportedUser);
        console.log(`💾 유저 정보 저장 완료`);
        const message = reportedUser.status === user_entity_1.UserStatus.STOP
            ? "🚨 신고가 누적되어 계정이 정지되었습니다!"
            : "⚠️ 신고가 접수되었습니다. 주의해 주세요!";
        await this.notificationService.sendNotification({
            user: reportedUser,
            content: message,
        });
        console.log(`📢 알림 전송 완료 → ${reportedUser.nickname}: ${message}`);
        await this.markHandled(report);
        console.log(`📋 신고 상태 처리됨으로 변경`);
        return true;
    }
    async markHandled(report) {
        report.handled = true;
        await this.reportRepository.save(report);
    }
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(report_entity_1.Report)),
    __param(1, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(2, (0, typeorm_1.InjectRepository)(chapter_entity_1.Chapter)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        user_service_1.UserService,
        notification_service_1.NotificationService])
], ReportService);
//# sourceMappingURL=report.service.js.map