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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementRead = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const announcement_entity_1 = require("./announcement.entity");
let AnnouncementRead = class AnnouncementRead {
    id;
    user;
    announcement;
    isRead;
    readAt;
};
exports.AnnouncementRead = AnnouncementRead;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AnnouncementRead.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.announcementReads, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", user_entity_1.User)
], AnnouncementRead.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => announcement_entity_1.Announcement, (announcement) => announcement.reads, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", announcement_entity_1.Announcement)
], AnnouncementRead.prototype, "announcement", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], AnnouncementRead.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AnnouncementRead.prototype, "readAt", void 0);
exports.AnnouncementRead = AnnouncementRead = __decorate([
    (0, typeorm_1.Entity)("announcement_reads")
], AnnouncementRead);
//# sourceMappingURL=announcementread.entity.js.map