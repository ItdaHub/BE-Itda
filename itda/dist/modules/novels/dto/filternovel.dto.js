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
exports.FilterNovelDto = exports.AgeGroup = exports.NovelType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var NovelType;
(function (NovelType) {
    NovelType["NEW"] = "new";
    NovelType["RELAY"] = "relay";
})(NovelType || (exports.NovelType = NovelType = {}));
var AgeGroup;
(function (AgeGroup) {
    AgeGroup[AgeGroup["Teens"] = 10] = "Teens";
    AgeGroup[AgeGroup["Twenties"] = 20] = "Twenties";
    AgeGroup[AgeGroup["Thirties"] = 30] = "Thirties";
    AgeGroup[AgeGroup["Forties"] = 40] = "Forties";
})(AgeGroup || (exports.AgeGroup = AgeGroup = {}));
class FilterNovelDto {
    type;
    genre;
    age;
}
exports.FilterNovelDto = FilterNovelDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: NovelType,
        example: NovelType.NEW,
        description: "소설 타입 (new: 새 소설, relay: 이어쓰기)",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(NovelType),
    __metadata("design:type", String)
], FilterNovelDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "로맨스",
        description: "장르명 (예: 로맨스, 스릴러, 무협 등)",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterNovelDto.prototype, "genre", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: AgeGroup,
        example: AgeGroup.Twenties,
        description: "추천 연령대 (10: 10대, 20: 20대, 30: 30대, 40: 40대)",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(AgeGroup),
    __metadata("design:type", Number)
], FilterNovelDto.prototype, "age", void 0);
//# sourceMappingURL=filternovel.dto.js.map