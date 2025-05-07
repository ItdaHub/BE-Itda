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
exports.CreateAiDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateAiDto {
    prompt;
    genre;
}
exports.CreateAiDto = CreateAiDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "AI가 생성할 프롬프트 문장",
        example: "여행을 주제로 한 짧은 소설을 생성해줘.",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAiDto.prototype, "prompt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "선택적으로 지정할 장르 (예: 로맨스, 스릴러 등)",
        example: "로맨스",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAiDto.prototype, "genre", void 0);
//# sourceMappingURL=create-ai.dto.js.map