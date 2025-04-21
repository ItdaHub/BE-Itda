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
exports.AnnouncementService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const announcement_entity_1 = require("./announcement.entity");
const announcementread_entity_1 = require("./announcementread.entity");
let AnnouncementService = class AnnouncementService {
    announcementRepo;
    readRepo;
    constructor(announcementRepo, readRepo) {
        this.announcementRepo = announcementRepo;
        this.readRepo = readRepo;
    }
    async createAnnouncement(title, content, admin, priority = "normal") {
        const newAnnouncement = this.announcementRepo.create({
            title,
            content,
            admin,
            priority,
        });
        const saved = await this.announcementRepo.save(newAnnouncement);
        return this.toDto(saved);
    }
    async deleteAnnouncement(id) {
        const found = await this.announcementRepo.findOne({ where: { id } });
        if (!found)
            throw new Error("해당 공지사항을 찾을 수 없습니다.");
        await this.announcementRepo.remove(found);
        return { message: "삭제되었습니다." };
    }
    async getAllAnnouncements() {
        const announcements = await this.announcementRepo.find({
            relations: ["admin"],
            order: { start_date: "DESC" },
        });
        return announcements.map((a) => this.toDto(a));
    }
    async getAnnouncementById(id) {
        const announcement = await this.announcementRepo.findOne({
            where: { id },
            relations: ["admin"],
        });
        if (!announcement) {
            throw new common_1.NotFoundException("공지사항을 찾을 수 없습니다.");
        }
        return this.toDto(announcement);
    }
    async updateAnnouncement(id, title, content, priority = "normal") {
        const announcement = await this.announcementRepo.findOne({
            where: { id },
            relations: ["admin"],
        });
        if (!announcement) {
            throw new common_1.NotFoundException(`Announcement with ID "${id}" not found`);
        }
        announcement.title = title;
        announcement.content = content;
        announcement.priority = priority;
        const updated = await this.announcementRepo.save(announcement);
        return this.toDto(updated);
    }
    toDto(entity) {
        const { id, title, content, priority, start_date, created_at, updated_at, admin, } = entity;
        return {
            id,
            title,
            content,
            priority,
            start_date,
            created_at,
            updated_at,
            admin: {
                id: admin.id,
                email: admin.email,
                nickname: admin.nickname,
            },
        };
    }
    async markAsRead(announcementId, userId) {
        const announcement = await this.announcementRepo.findOne({
            where: { id: announcementId },
        });
        if (!announcement)
            throw new common_1.NotFoundException("공지사항이 없습니다.");
        const alreadyRead = await this.readRepo.findOne({
            where: { announcement: { id: announcementId }, user: { id: userId } },
        });
        if (!alreadyRead) {
            const read = this.readRepo.create({
                announcement,
                user: { id: userId },
            });
            await this.readRepo.save(read);
        }
        return { message: "읽음 처리 완료" };
    }
    async getUnreadAnnouncements(userId) {
        const allAnnouncements = await this.announcementRepo.find({
            relations: ["admin"],
            order: { start_date: "DESC" },
        });
        const readAnnouncements = await this.readRepo.find({
            where: { user: { id: userId } },
            relations: ["announcement"],
        });
        const readIds = new Set(readAnnouncements.map((read) => read.announcement.id));
        const unread = allAnnouncements.filter((a) => !readIds.has(a.id));
        return unread.map((a) => this.toDto(a));
    }
};
exports.AnnouncementService = AnnouncementService;
exports.AnnouncementService = AnnouncementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(announcement_entity_1.Announcement)),
    __param(1, (0, typeorm_1.InjectRepository)(announcementread_entity_1.AnnouncementRead)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AnnouncementService);
//# sourceMappingURL=announcement.service.js.map