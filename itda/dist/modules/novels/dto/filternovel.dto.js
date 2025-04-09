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
var NovelType;
(function (NovelType) {
    NovelType["FIRST"] = "first";
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
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(NovelType),
    __metadata("design:type", String)
], FilterNovelDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterNovelDto.prototype, "genre", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(AgeGroup),
    __metadata("design:type", Number)
], FilterNovelDto.prototype, "age", void 0);
//# sourceMappingURL=filternovel.dto.js.map