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
exports.Chapter = void 0;
const typeorm_1 = require("typeorm");
const novel_entity_1 = require("../../novels/entities/novel.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const comment_entity_1 = require("../../comments/entities/comment.entity");
const report_entity_1 = require("../../reports/entities/report.entity");
let Chapter = class Chapter {
    id;
    novel;
    author;
    content;
    chapter_number;
    created_at;
    comments;
    reports;
    isPaid;
};
exports.Chapter = Chapter;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Chapter.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => novel_entity_1.Novel, (novel) => novel.chapters, { onDelete: "CASCADE" }),
    __metadata("design:type", novel_entity_1.Novel)
], Chapter.prototype, "novel", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.chapters, { onDelete: "CASCADE" }),
    __metadata("design:type", user_entity_1.User)
], Chapter.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Chapter.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], Chapter.prototype, "chapter_number", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Chapter.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comment_entity_1.Comment, (comment) => comment.chapter),
    __metadata("design:type", Array)
], Chapter.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => report_entity_1.Report, (report) => report.chapter),
    __metadata("design:type", Array)
], Chapter.prototype, "reports", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Chapter.prototype, "isPaid", void 0);
exports.Chapter = Chapter = __decorate([
    (0, typeorm_1.Entity)("chapters")
], Chapter);
//# sourceMappingURL=chapter.entity.js.map