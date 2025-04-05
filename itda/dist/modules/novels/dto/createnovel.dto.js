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
class CreateNovelDto {
    title;
    category;
    peopleNum;
    content;
    type;
    age_group;
    userId;
}
exports.CreateNovelDto = CreateNovelDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 10),
    __metadata("design:type", String)
], CreateNovelDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(["romance", "ropan", "fantasy", "hyenpan", "muhyeop"]),
    __metadata("design:type", String)
], CreateNovelDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(["five", "seven", "nine"]),
    __metadata("design:type", String)
], CreateNovelDto.prototype, "peopleNum", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.Length)(10, 300),
    __metadata("design:type", String)
], CreateNovelDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(["home", "relay", "contest"]),
    __metadata("design:type", String)
], CreateNovelDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(["teen", "twenties", "thirties", "forties"]),
    __metadata("design:type", String)
], CreateNovelDto.prototype, "age_group", void 0);
//# sourceMappingURL=createnovel.dto.js.map