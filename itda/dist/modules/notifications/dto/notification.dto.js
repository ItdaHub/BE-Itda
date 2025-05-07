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
exports.SendNotificationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SendNotificationDto {
    user;
    content;
    novel;
    report;
    type;
}
exports.SendNotificationDto = SendNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: { id: 1, email: "user@example.com" },
        description: "알림을 받을 사용자 (요약 정보 또는 사용자 ID)",
    }),
    __metadata("design:type", Object)
], SendNotificationDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "신고가 접수되었습니다.",
        description: "알림 내용",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: { id: 5, title: "신고된 소설 제목" },
        description: "관련 소설 정보 (선택)",
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SendNotificationDto.prototype, "novel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: { id: 10, reason: "욕설 포함" },
        description: "관련 신고 정보 (선택)",
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SendNotificationDto.prototype, "report", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: ["REPORT", "NOVEL_SUBMIT"],
        example: "REPORT",
        description: "알림 유형",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(["REPORT", "NOVEL_SUBMIT"]),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "type", void 0);
//# sourceMappingURL=notification.dto.js.map