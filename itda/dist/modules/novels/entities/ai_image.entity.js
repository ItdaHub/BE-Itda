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
exports.AIGeneratedImage = void 0;
const typeorm_1 = require("typeorm");
const novel_entity_1 = require("./novel.entity");
const chapter_entity_1 = require("../../chapter/entities/chapter.entity");
let AIGeneratedImage = class AIGeneratedImage {
    id;
    novel;
    chapter;
    image_url;
    created_at;
};
exports.AIGeneratedImage = AIGeneratedImage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AIGeneratedImage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => novel_entity_1.Novel, (novel) => novel.id),
    __metadata("design:type", novel_entity_1.Novel)
], AIGeneratedImage.prototype, "novel", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chapter_entity_1.Chapter, { nullable: true, onDelete: "SET NULL" }),
    __metadata("design:type", Object)
], AIGeneratedImage.prototype, "chapter", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], AIGeneratedImage.prototype, "image_url", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AIGeneratedImage.prototype, "created_at", void 0);
exports.AIGeneratedImage = AIGeneratedImage = __decorate([
    (0, typeorm_1.Entity)("ai_generated_images")
], AIGeneratedImage);
//# sourceMappingURL=ai_image.entity.js.map