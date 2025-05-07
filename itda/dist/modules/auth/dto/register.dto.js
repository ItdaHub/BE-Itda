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
exports.RegisterDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../users/user.entity");
class RegisterDto {
    email;
    name;
    nickname;
    password;
    birthYear;
    phone;
    type;
    age_group;
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "user@example.com",
        description: "사용자 이메일 (필수)",
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "홍길동",
        description: "사용자 실명 (선택)",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "travelKing123",
        description: "닉네임 (필수)",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "nickname", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "securePassword123!",
        description: "비밀번호 (소셜 로그인 시 생략 가능)",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "1990",
        description: "출생년도 (선택)",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "birthYear", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "010-1234-5678",
        description: "휴대폰 번호 (선택)",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: user_entity_1.LoginType,
        description: "회원가입 타입 (local, kakao, naver, google 등)",
        example: "local",
    }),
    (0, class_validator_1.IsEnum)(user_entity_1.LoginType),
    __metadata("design:type", String)
], RegisterDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 20,
        description: "연령대 그룹 (10~40 사이)",
        minimum: 10,
        maximum: 40,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(10),
    (0, class_validator_1.Max)(40),
    __metadata("design:type", Number)
], RegisterDto.prototype, "age_group", void 0);
//# sourceMappingURL=register.dto.js.map