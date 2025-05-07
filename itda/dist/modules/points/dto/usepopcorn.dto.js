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
exports.UsePopcornDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UsePopcornDto {
    userId;
    amount;
    description;
    novelId;
    chapterId;
}
exports.UsePopcornDto = UsePopcornDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "유저 ID",
        example: 1,
    }),
    (0, class_validator_1.IsInt)({ message: "userId는 정수여야 합니다." }),
    __metadata("design:type", Number)
], UsePopcornDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "사용할 팝콘 개수",
        example: 10,
    }),
    (0, class_validator_1.IsInt)({ message: "amount는 정수여야 합니다." }),
    (0, class_validator_1.IsPositive)({ message: "amount는 0보다 커야 합니다." }),
    __metadata("design:type", Number)
], UsePopcornDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "사용 내역 설명",
        example: "챕터 열람",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "description은 문자열이어야 합니다." }),
    __metadata("design:type", String)
], UsePopcornDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "소설 ID (해당되는 경우)",
        example: 101,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UsePopcornDto.prototype, "novelId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "챕터 ID (해당되는 경우)",
        example: 5,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UsePopcornDto.prototype, "chapterId", void 0);
//# sourceMappingURL=usepopcorn.dto.js.map