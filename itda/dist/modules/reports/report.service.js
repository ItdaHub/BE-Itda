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
const report_entity_1 = require("./report.entity");
const comment_entity_1 = require("../comments/comment.entity");
const chapter_entity_1 = require("../chapter/chapter.entity");
const user_entity_1 = require("../users/user.entity");
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
        return this.reportRepository.find({ relations: ["reporter"] });
    }
    async findOne(id) {
        const report = await this.reportRepository.findOne({
            where: { id },
            relations: ["reporter"],
        });
        if (!report) {
            throw new common_1.NotFoundException(`Report with ID ${id} not found`);
        }
        return report;
    }
    async create(report) {
        if (report.target_type === report_entity_1.TargetType.COMMENT) {
            const comment = await this.commentRepository.findOneBy({
                id: report.target_id,
            });
            if (!comment)
                throw new common_1.NotFoundException("댓글을 찾을 수 없습니다.");
            report.reported_content = comment.content;
        }
        else if (report.target_type === report_entity_1.TargetType.CHAPTER) {
            const chapter = await this.chapterRepository.findOne({
                where: { id: report.target_id },
                relations: ["novel"],
            });
            if (!chapter)
                throw new common_1.NotFoundException("챕터를 찾을 수 없습니다.");
            report.reported_content = `[${chapter.novel.title} - ${chapter.chapter_number}화]\n${chapter.content}`;
        }
        return this.reportRepository.save(report);
    }
    async delete(id) {
        const report = await this.reportRepository.findOne({ where: { id } });
        if (!report)
            return false;
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
                relations: ["writer"],
            });
            return chapter?.author ?? null;
        }
        return null;
    }
    async handleReport(reportId) {
        const report = await this.findOne(reportId);
        if (!report)
            throw new common_1.NotFoundException("해당 신고가 존재하지 않습니다.");
        const reportedUser = await this.findReportedUser(report);
        if (!reportedUser)
            throw new common_1.NotFoundException("신고 대상 유저를 찾을 수 없습니다.");
        reportedUser.report_count += 1;
        let message = "⚠️ 신고가 접수되었습니다. 주의해 주세요!";
        if (reportedUser.report_count >= 2) {
            reportedUser.status = user_entity_1.UserStatus.BANNED;
            message = "🚨 신고가 누적되어 계정이 정지되었습니다!";
        }
        await this.userService.save(reportedUser);
        await this.notificationService.sendNotification({
            user: reportedUser,
            content: message,
        });
        return "신고 처리 완료";
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