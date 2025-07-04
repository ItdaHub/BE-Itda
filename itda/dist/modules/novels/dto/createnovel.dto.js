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
exports.CreateNovelDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateNovelDto {
    categoryId;
    peopleNum;
    title;
    content;
    type;
    imageUrl;
    tags;
}
exports.CreateNovelDto = CreateNovelDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: "카테고리(장르)의 ID (예: 로맨스=1, 스릴러=2 등)",
    }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateNovelDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 3,
        description: "참여할 작가 수",
    }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateNovelDto.prototype, "peopleNum", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "잃어버린 세계",
        description: "소설 제목 (최대 10자)",
        maxLength: 10,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], CreateNovelDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "이 소설은 새로운 세계를 찾아 떠나는 여행자의 이야기입니다...",
        description: "소설 소개글 (10~1500자)",
        minLength: 10,
        maxLength: 1500,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.MaxLength)(1500),
    __metadata("design:type", String)
], CreateNovelDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ["new", "relay"],
        example: "new",
        description: "소설 유형: 'new' (새 소설 시작) 또는 'relay' (이어쓰기)",
    }),
    (0, class_validator_1.IsEnum)(["new", "relay"], {
        message: "type은 'new' 또는 'relay'만 가능합니다.",
    }),
    __metadata("design:type", String)
], CreateNovelDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "https://example.com/image.jpg",
        description: "썸네일 이미지 URL (선택)",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNovelDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: ["판타지", "로맨스"],
        description: "소설에 달 태그 목록 (문자열 배열)",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ArrayMaxSize)(5, { message: "태그는 최대 5개까지 입력할 수 있습니다." }),
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateNovelDto.prototype, "tags", void 0);
//# sourceMappingURL=createnovel.dto.js.map