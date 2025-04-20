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
exports.Report = exports.TargetType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const notification_entity_1 = require("../notifications/notification.entity");
const chapter_entity_1 = require("../chapter/chapter.entity");
var TargetType;
(function (TargetType) {
    TargetType["CHAPTER"] = "chapter";
    TargetType["COMMENT"] = "comment";
})(TargetType || (exports.TargetType = TargetType = {}));
let Report = class Report {
    id;
    reporter;
    target_type;
    target_id;
    reason;
    reported_content;
    chapter;
    reported_user_id;
    created_at;
    notifications;
    handled;
};
exports.Report = Report;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Report.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.reports, { onDelete: "CASCADE" }),
    __metadata("design:type", user_entity_1.User)
], Report.prototype, "reporter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: TargetType }),
    __metadata("design:type", String)
], Report.prototype, "target_type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Report.prototype, "target_id", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Report.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", String)
], Report.prototype, "reported_content", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chapter_entity_1.Chapter, (chapter) => chapter.reports, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", chapter_entity_1.Chapter)
], Report.prototype, "chapter", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Report.prototype, "reported_user_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Report.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_entity_1.Notification, (notification) => notification.report, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Report.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Report.prototype, "handled", void 0);
exports.Report = Report = __decorate([
    (0, typeorm_1.Entity)("reports")
], Report);
//# sourceMappingURL=report.entity.js.map