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
exports.User = exports.UserStatus = exports.UserType = exports.LoginType = void 0;
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const payment_entity_1 = require("../payments/payment.entity");
const novel_entity_1 = require("../novels/novel.entity");
const participant_entity_1 = require("../novels/participant.entity");
const chapter_entity_1 = require("../novels/chapter.entity");
const comment_entity_1 = require("../interactions/comment.entity");
const like_entity_1 = require("../likes/like.entity");
const report_entity_1 = require("../reports/report.entity");
const notification_entity_1 = require("../notifications/notification.entity");
const vote_entity_1 = require("../interactions/vote.entity");
const point_entity_1 = require("../payments/point.entity");
var LoginType;
(function (LoginType) {
    LoginType["LOCAL"] = "local";
    LoginType["KAKAO"] = "kakao";
    LoginType["NAVER"] = "naver";
    LoginType["GOOGLE"] = "google";
})(LoginType || (exports.LoginType = LoginType = {}));
var UserType;
(function (UserType) {
    UserType["ADMIN"] = "admin";
    UserType["USER"] = "user";
})(UserType || (exports.UserType = UserType = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["BANNED"] = "banned";
    UserStatus["DELETED"] = "deleted";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
let User = class User {
    id;
    email;
    password;
    profile_img;
    phone;
    type;
    name;
    nickname;
    age;
    created_at;
    user_type;
    status;
    payments;
    novels;
    participants;
    chapters;
    comments;
    likes;
    reports;
    notifications;
    votes;
    points;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ select: false, nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], User.prototype, "profile_img", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: LoginType, default: LoginType.LOCAL }),
    __metadata("design:type", String)
], User.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], User.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "age", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: UserType, default: UserType.USER }),
    __metadata("design:type", String)
], User.prototype, "user_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: UserStatus }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_entity_1.Payment, (payment) => payment.user),
    __metadata("design:type", Array)
], User.prototype, "payments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => novel_entity_1.Novel, (novel) => novel.creator),
    __metadata("design:type", Array)
], User.prototype, "novels", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => participant_entity_1.Participant, (participant) => participant.user),
    __metadata("design:type", Array)
], User.prototype, "participants", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => chapter_entity_1.Chapter, (chapter) => chapter.author),
    __metadata("design:type", Array)
], User.prototype, "chapters", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comment_entity_1.Comment, (comment) => comment.user),
    __metadata("design:type", Array)
], User.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => like_entity_1.Like, (like) => like.user),
    __metadata("design:type", Array)
], User.prototype, "likes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => report_entity_1.Report, (report) => report.reporter),
    __metadata("design:type", Array)
], User.prototype, "reports", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_entity_1.Notification, (notification) => notification.user),
    __metadata("design:type", Array)
], User.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vote_entity_1.Vote, (vote) => vote.user),
    __metadata("design:type", Array)
], User.prototype, "votes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => point_entity_1.Point, (point) => point.user),
    __metadata("design:type", Array)
], User.prototype, "points", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)("users")
], User);
//# sourceMappingURL=user.entity.js.map