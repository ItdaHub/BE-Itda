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
exports.AnnouncementWithAdminDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class AdminInfoDto {
    id;
    email;
    nickname;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: "관리자 ID" }),
    __metadata("design:type", Number)
], AdminInfoDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "admin@example.com", description: "관리자 이메일" }),
    __metadata("design:type", String)
], AdminInfoDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "관리자닉네임", description: "관리자 닉네임" }),
    __metadata("design:type", String)
], AdminInfoDto.prototype, "nickname", void 0);
class AnnouncementWithAdminDto {
    id;
    title;
    content;
    priority;
    start_date;
    created_at;
    updated_at;
    admin;
    isRead;
}
exports.AnnouncementWithAdminDto = AnnouncementWithAdminDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: "공지사항 ID" }),
    __metadata("design:type", Number)
], AnnouncementWithAdminDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "중요 공지", description: "공지 제목" }),
    __metadata("design:type", String)
], AnnouncementWithAdminDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "시스템 점검이 예정되어 있습니다.",
        description: "공지 내용",
    }),
    __metadata("design:type", String)
], AnnouncementWithAdminDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ["urgent", "normal"], description: "공지 우선순위" }),
    __metadata("design:type", String)
], AnnouncementWithAdminDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "2025-04-29T09:00:00.000Z",
        description: "공지 시작 날짜",
    }),
    __metadata("design:type", Date)
], AnnouncementWithAdminDto.prototype, "start_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "2025-04-28T12:00:00.000Z",
        description: "공지 생성 일시",
    }),
    __metadata("design:type", Date)
], AnnouncementWithAdminDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "2025-04-28T15:30:00.000Z",
        description: "공지 수정 일시",
    }),
    __metadata("design:type", Date)
], AnnouncementWithAdminDto.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: () => AdminInfoDto,
        description: "공지 작성자 관리자 정보",
    }),
    __metadata("design:type", AdminInfoDto)
], AnnouncementWithAdminDto.prototype, "admin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: "해당 사용자가 읽었는지 여부" }),
    __metadata("design:type", Boolean)
], AnnouncementWithAdminDto.prototype, "isRead", void 0);
//# sourceMappingURL=announcement.dto.js.map