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
exports.ChapterContentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ChapterContentDto {
    id;
    chapterNumber;
    content;
    createdAt;
}
exports.ChapterContentDto = ChapterContentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: "챕터 ID" }),
    __metadata("design:type", Number)
], ChapterContentDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, description: "챕터 번호" }),
    __metadata("design:type", Number)
], ChapterContentDto.prototype, "chapterNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "주인공은 고요한 밤 속에서 조용히 걸어가고 있었다...",
        description: "챕터 본문",
    }),
    __metadata("design:type", String)
], ChapterContentDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "2024-04-16T12:00:00Z",
        description: "챕터 생성 날짜",
    }),
    __metadata("design:type", Date)
], ChapterContentDto.prototype, "createdAt", void 0);
//# sourceMappingURL=chaptercontent.dto.js.map