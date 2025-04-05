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
exports.Like = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const novel_entity_1 = require("../novels/novel.entity");
const comment_entity_1 = require("../comments/comment.entity");
let Like = class Like {
    id;
    user;
    target_type;
    novel;
    comment;
    created_at;
};
exports.Like = Like;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Like.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.likes, { onDelete: "CASCADE" }),
    __metadata("design:type", user_entity_1.User)
], Like.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: ["novel", "comment"] }),
    __metadata("design:type", String)
], Like.prototype, "target_type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => novel_entity_1.Novel, (novel) => novel.likes, {
        onDelete: "CASCADE",
        nullable: true,
    }),
    __metadata("design:type", Object)
], Like.prototype, "novel", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => comment_entity_1.Comment, (comment) => comment.likes, {
        onDelete: "CASCADE",
        nullable: true,
    }),
    __metadata("design:type", Object)
], Like.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Like.prototype, "created_at", void 0);
exports.Like = Like = __decorate([
    (0, typeorm_1.Entity)("likes"),
    (0, typeorm_1.Check)(`(target_type = 'novel' AND novel_id IS NOT NULL AND comment_id IS NULL) OR 
        (target_type = 'comment' AND comment_id IS NOT NULL AND novel_id IS NULL)`)
], Like);
//# sourceMappingURL=like.entity.js.map