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
const announcement_entity_1 = require("./entities/announcement.entity");
const user_entity_1 = require("../users/entities/user.entity");
const announcementread_entity_1 = require("./entities/announcementread.entity");
let AnnouncementService = class AnnouncementService {
    announcementRepository;
    readRepository;
    userRepository;
    constructor(announcementRepository, readRepository, userRepository) {
        this.announcementRepository = announcementRepository;
        this.readRepository = readRepository;
        this.userRepository = userRepository;
    }
    async createAnnouncement(title, content, admin, priority = "normal") {
        const newAnnouncement = this.announcementRepository.create({
            title,
            content,
            admin,
            priority,
        });
        const saved = await this.announcementRepository.save(newAnnouncement);
        return this.toDto(saved);
    }
    async deleteAnnouncement(id) {
        const found = await this.announcementRepository.findOne({ where: { id } });
        if (!found)
            throw new Error("해당 공지사항을 찾을 수 없습니다.");
        await this.announcementRepository.remove(found);
        return { message: "삭제되었습니다." };
    }
    async getAllAnnouncements(userId) {
        const announcements = await this.announcementRepository.find({
            relations: ["admin"],
            order: { start_date: "DESC" },
        });
        let readIds = new Set();
        if (userId) {
            const readAnnouncements = await this.readRepository.find({
                where: { user: { id: userId } },
                relations: ["announcement"],
            });
            readIds = new Set(readAnnouncements.map((read) => read.announcement.id));
        }
        return announcements.map((a) => {
            const isRead = userId ? readIds.has(a.id) : false;
            return this.toDto(a, isRead);
        });
    }
    async getAnnouncementById(id) {
        const announcement = await this.announcementRepository.findOne({
            where: { id },
            relations: ["admin"],
        });
        if (!announcement) {
            throw new common_1.NotFoundException("공지사항을 찾을 수 없습니다.");
        }
        return this.toDto(announcement);
    }
    async updateAnnouncement(id, title, content, priority = "normal") {
        const announcement = await this.announcementRepository.findOne({
            where: { id },
            relations: ["admin"],
        });
        if (!announcement) {
            throw new common_1.NotFoundException(`Announcement with ID "${id}" not found`);
        }
        announcement.title = title;
        announcement.content = content;
        announcement.priority = priority;
        const updated = await this.announcementRepository.save(announcement);
        return this.toDto(updated);
    }
    async markAsRead(announcementId, userId) {
        const announcement = await this.announcementRepository.findOne({
            where: { id: announcementId },
        });
        if (!announcement)
            throw new common_1.NotFoundException("공지사항이 없습니다.");
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException("사용자를 찾을 수 없습니다.");
        const alreadyRead = await this.readRepository.findOne({
            where: { announcement: { id: announcementId }, user: { id: userId } },
        });
        console.log(`공지사항 읽음 여부 확인: announcementId=${announcementId}, userId=${userId}`);
        if (alreadyRead) {
            console.log("이미 읽음 처리됨");
            return { message: "이미 읽음 처리됨" };
        }
        const read = this.readRepository.create({
            announcement,
            user,
            isRead: true,
        });
        await this.readRepository.save(read);
        console.log("읽음 처리 완료: announcementId=", announcementId);
        return { message: "읽음 처리 완료" };
    }
    toDto(entity, isRead = false) {
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
            isRead,
        };
    }
};
exports.AnnouncementService = AnnouncementService;
exports.AnnouncementService = AnnouncementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(announcement_entity_1.Announcement)),
    __param(1, (0, typeorm_1.InjectRepository)(announcementread_entity_1.AnnouncementRead)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AnnouncementService);
//# sourceMappingURL=announcement.service.js.map