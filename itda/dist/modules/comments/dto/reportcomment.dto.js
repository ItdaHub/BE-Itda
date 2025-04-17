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
exports.ReportCommentDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ReportCommentDto {
    userId;
    reason;
}
exports.ReportCommentDto = ReportCommentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 42, description: "신고한 사용자 ID" }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ReportCommentDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "욕설이 있습니다.", description: "신고 사유" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], ReportCommentDto.prototype, "reason", void 0);
//# sourceMappingURL=reportcomment.dto.js.map