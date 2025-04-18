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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UserController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const swagger_1 = require("@nestjs/swagger");
const jwtauth_guard_1 = require("../auth/jwtauth.guard");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const ceateuser_dto_1 = require("./dto/ceateuser.dto");
const updateuser_dto_1 = require("./dto/updateuser.dto");
let UserController = UserController_1 = class UserController {
    userService;
    logger = new common_1.Logger(UserController_1.name);
    constructor(userService) {
        this.userService = userService;
    }
    findAll() {
        return this.userService.findAll();
    }
    findOne(id) {
        return this.userService.findOne(id);
    }
    create(user) {
        return this.userService.create(user);
    }
    update(id, user) {
        this.logger.log(`[PUT /users/${id}] 요청 받음`);
        this.logger.log(`[PUT /users/${id}] ID: ${id}, 데이터: ${JSON.stringify(user)}`);
        return this.userService.update(id, user);
    }
    async deleteByEmail(email) {
        return this.userService.removeByEmail(email);
    }
    async updateNickname(req, nickname) {
        const userId = req.user.id;
        await this.userService.update(userId, { nickname });
        return { message: "닉네임이 성공적으로 변경되었습니다.", nickname };
    }
    async updatePhone(req, phone) {
        const userId = req.user.id;
        await this.userService.update(userId, { phone });
        return { message: "전화번호가 성공적으로 변경되었습니다.", phone };
    }
    async uploadProfileImage(req, file) {
        const userId = req.user.id;
        if (!file) {
            return { message: "프로필 이미지를 선택해주세요." };
        }
        await this.userService.updateProfileImage(userId, file.filename);
        return {
            message: "프로필 이미지가 성공적으로 업데이트되었습니다.",
            filename: file.filename,
        };
    }
    async deleteMyAccount(req) {
        const userId = req.user.id;
        const requestUser = req.user;
        await this.userService.remove(userId, requestUser);
    }
    async deleteUsersByAdmin(userIds) {
        await this.userService.deleteUsersByAdmin(userIds);
        return { message: "선택한 유저들이 완전히 삭제되었습니다." };
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "유저 전체 목록 조회" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "유저 상세 조회" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "유저 ID" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "유저 생성" }),
    (0, swagger_1.ApiBody)({ type: ceateuser_dto_1.CreateUserDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ceateuser_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "유저 정보 수정" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "유저 ID" }),
    (0, swagger_1.ApiBody)({ type: updateuser_dto_1.UpdateUserDto }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, updateuser_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)("delete/email/:email"),
    (0, swagger_1.ApiOperation)({ summary: "이메일 기반 유저 삭제" }),
    (0, swagger_1.ApiParam)({ name: "email", description: "유저 이메일" }),
    __param(0, (0, common_1.Param)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteByEmail", null);
__decorate([
    (0, common_1.Put)("me/nickname"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "내 닉네임 변경" }),
    (0, swagger_1.ApiBody)({
        schema: { type: "object", properties: { nickname: { type: "string" } } },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)("nickname")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateNickname", null);
__decorate([
    (0, common_1.Put)("me/phone"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "내 전화번호 변경" }),
    (0, swagger_1.ApiBody)({
        schema: { type: "object", properties: { phone: { type: "string" } } },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)("phone")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePhone", null);
__decorate([
    (0, common_1.Put)("me/profile-image"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "내 프로필 이미지 업데이트" }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("profileImage", {
        storage: (0, multer_1.diskStorage)({
            destination: "./uploads/profiles",
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `profile-${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        }),
        limits: { fileSize: 1024 * 1024 * 5 },
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadProfileImage", null);
__decorate([
    (0, common_1.Delete)("me"),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: "내 계정 삭제 (회원 탈퇴)" }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteMyAccount", null);
__decorate([
    (0, common_1.Delete)("admin/delete"),
    (0, swagger_1.ApiOperation)({ summary: "관리자가 여러 유저를 완전 삭제" }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                userIds: {
                    type: "array",
                    items: { type: "number" },
                    example: [1, 2, 3],
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)("userIds")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUsersByAdmin", null);
exports.UserController = UserController = UserController_1 = __decorate([
    (0, swagger_1.ApiTags)("User (유저)"),
    (0, common_1.Controller)("users"),
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map