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
exports.RecentNovel = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const novel_entity_1 = require("./novel.entity");
let RecentNovel = class RecentNovel {
    id;
    user;
    novel;
    chapterNumber;
    viewedAt;
};
exports.RecentNovel = RecentNovel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RecentNovel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: "CASCADE" }),
    __metadata("design:type", user_entity_1.User)
], RecentNovel.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => novel_entity_1.Novel, { eager: true, onDelete: "CASCADE" }),
    __metadata("design:type", novel_entity_1.Novel)
], RecentNovel.prototype, "novel", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RecentNovel.prototype, "chapterNumber", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RecentNovel.prototype, "viewedAt", void 0);
exports.RecentNovel = RecentNovel = __decorate([
    (0, typeorm_1.Entity)("recent_novels"),
    (0, typeorm_1.Unique)(["user", "novel", "chapterNumber"])
], RecentNovel);
//# sourceMappingURL=recentNovel.entity.js.map