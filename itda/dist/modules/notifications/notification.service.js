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
const notification_entity_1 = require("./notification.entity");
const user_entity_1 = require("../users/user.entity");
const novel_entity_1 = require("../novels/novel.entity");
const report_entity_1 = require("../reports/report.entity");
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
    async createNotification(userId, novelId, reportId, content) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error("User not found");
        }
        const novel = novelId
            ? await this.novelRepository.findOne({ where: { id: novelId } })
            : null;
        const report = reportId
            ? await this.reportRepository.findOne({ where: { id: reportId } })
            : null;
        const notification = this.notificationRepository.create({
            user,
            novel,
            report,
            content,
            is_read: false,
        });
        return this.notificationRepository.save(notification);
    }
    async getNotificationsByUser(userId) {
        return this.notificationRepository.find({
            where: { user: { id: userId } },
            relations: ["novel", "report"],
            order: { created_at: "DESC" },
        });
    }
    async markNotificationAsRead(notificationId) {
        const notification = await this.notificationRepository.findOne({
            where: { id: notificationId },
        });
        if (!notification) {
            throw new Error("Notification not found");
        }
        notification.is_read = true;
        return this.notificationRepository.save(notification);
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