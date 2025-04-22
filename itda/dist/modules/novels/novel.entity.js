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
exports.Novel = exports.NovelType = exports.NovelStatus = exports.MaxParticipants = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const genre_entity_1 = require("../genre/genre.entity");
const participant_entity_1 = require("./participant.entity");
const chapter_entity_1 = require("../chapter/chapter.entity");
const ai_image_entity_1 = require("./ai_image.entity");
const like_entity_1 = require("../likes/like.entity");
const comment_entity_1 = require("../comments/comment.entity");
const notification_entity_1 = require("../notifications/notification.entity");
var MaxParticipants;
(function (MaxParticipants) {
    MaxParticipants[MaxParticipants["FIVE"] = 5] = "FIVE";
    MaxParticipants[MaxParticipants["SEVEN"] = 7] = "SEVEN";
    MaxParticipants[MaxParticipants["NINE"] = 9] = "NINE";
})(MaxParticipants || (exports.MaxParticipants = MaxParticipants = {}));
var NovelStatus;
(function (NovelStatus) {
    NovelStatus["ONGOING"] = "ongoing";
    NovelStatus["COMPLETED"] = "completed";
    NovelStatus["SUBMITTED"] = "submitted";
})(NovelStatus || (exports.NovelStatus = NovelStatus = {}));
var NovelType;
(function (NovelType) {
    NovelType["NEW"] = "new";
    NovelType["RELAY"] = "relay";
})(NovelType || (exports.NovelType = NovelType = {}));
let Novel = class Novel {
    id;
    title;
    creator;
    author;
    max_participants;
    status;
    imageUrl;
    type;
    created_at;
    genre;
    isPublished;
    participants;
    chapters;
    aiGeneratedImages;
    likes;
    likeCount;
    comments;
    notifications;
    age_group;
    viewCount;
};
exports.Novel = Novel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Novel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Novel.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.createdNovels, {
        onDelete: "SET NULL",
        nullable: true,
    }),
    __metadata("design:type", user_entity_1.User)
], Novel.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.authoredNovels, {
        onDelete: "SET NULL",
        nullable: true,
    }),
    __metadata("design:type", user_entity_1.User)
], Novel.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: MaxParticipants }),
    __metadata("design:type", Number)
], Novel.prototype, "max_participants", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: NovelStatus,
        default: NovelStatus.ONGOING,
    }),
    __metadata("design:type", String)
], Novel.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Novel.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: NovelType, nullable: true }),
    __metadata("design:type", String)
], Novel.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Novel.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => genre_entity_1.Genre, (genre) => genre.novels, {
        onDelete: "SET NULL",
        nullable: true,
    }),
    __metadata("design:type", genre_entity_1.Genre)
], Novel.prototype, "genre", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Novel.prototype, "isPublished", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => participant_entity_1.Participant, (participant) => participant.novel),
    __metadata("design:type", Array)
], Novel.prototype, "participants", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => chapter_entity_1.Chapter, (chapter) => chapter.novel),
    __metadata("design:type", Array)
], Novel.prototype, "chapters", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ai_image_entity_1.AIGeneratedImage, (image) => image.novel),
    __metadata("design:type", Array)
], Novel.prototype, "aiGeneratedImages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => like_entity_1.Like, (like) => like.novel),
    __metadata("design:type", Array)
], Novel.prototype, "likes", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Novel.prototype, "likeCount", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comment_entity_1.Comment, (comment) => comment.novel),
    __metadata("design:type", Array)
], Novel.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_entity_1.Notification, (notification) => notification.novel),
    __metadata("design:type", Array)
], Novel.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Number)
], Novel.prototype, "age_group", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Novel.prototype, "viewCount", void 0);
exports.Novel = Novel = __decorate([
    (0, typeorm_1.Entity)("novels")
], Novel);
//# sourceMappingURL=novel.entity.js.map