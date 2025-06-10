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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("./entities/notification.entity");
const user_entity_1 = require("../users/entities/user.entity");
const novel_entity_1 = require("../novels/entities/novel.entity");
const report_entity_1 = require("../reports/entities/report.entity");
let NotificationService = class NotificationService {
    notificationRepository;
    userRepository;
    novelRepository;
    reportRepository;
    constructor(notificationRepository, userRepository, novelRepository, reportRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.novelRepository = novelRepository;
        this.reportRepository = reportRepository;
    }
    async getUserNotifications(userId) {
        return this.notificationRepository.find({
            where: { user: { id: userId } },
            order: { created_at: "DESC" },
        });
    }
    async sendNotification({ user, content, novel = null, report = null, type = "REPORT", }) {
        const notification = this.notificationRepository.create({
            user,
            content,
            novel,
            report,
            type,
        });
        return await this.notificationRepository.save(notification);
    }
    async markNotificationAsRead(notificationId, userId) {
        const notification = await this.notificationRepository.findOne({
            where: {
                id: notificationId,
                user: { id: userId },
            },
            relations: ["user"],
        });
        if (!notification) {
            console.log(`❌ 알림 ${notificationId} (user: ${userId}) 찾을 수 없음`);
            throw new Error("해당 유저의 알림을 찾을 수 없습니다.");
        }
        notification.is_read = true;
        const saved = await this.notificationRepository.save(notification);
        console.log(`✅ 알림 ${notificationId} 읽음 처리 완료 (user: ${userId})`);
        return saved;
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(novel_entity_1.Novel)),
    __param(3, (0, typeorm_1.InjectRepository)(report_entity_1.Report)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], NotificationService);
//# sourceMappingURL=notification.service.js.map