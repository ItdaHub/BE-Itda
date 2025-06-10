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
exports.RecentNovelDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class RecentNovelDto {
    id;
    novelId;
    novelTitle;
    thumbnailUrl;
    viewedAt;
    constructor(recent) {
        this.id = recent.id;
        this.novelId = recent.novel.id;
        this.novelTitle = recent.novel.title;
        this.thumbnailUrl = recent.novel.imageUrl;
        this.viewedAt = recent.viewedAt;
    }
}
exports.RecentNovelDto = RecentNovelDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: "최근 본 기록 ID" }),
    __metadata("design:type", Number)
], RecentNovelDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 101, description: "소설 ID" }),
    __metadata("design:type", Number)
], RecentNovelDto.prototype, "novelId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "달빛 아래의 속삭임", description: "소설 제목" }),
    __metadata("design:type", String)
], RecentNovelDto.prototype, "novelTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "https://example.com/thumbnail.jpg",
        description: "소설 썸네일 이미지 URL",
        required: false,
    }),
    __metadata("design:type", String)
], RecentNovelDto.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "2025-06-09T11:58:00.000Z",
        description: "최근 본 날짜/시간",
    }),
    __metadata("design:type", Date)
], RecentNovelDto.prototype, "viewedAt", void 0);
//# sourceMappingURL=recentNovel.dto.js.map