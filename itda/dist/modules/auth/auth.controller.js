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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const localauth_guard_1 = require("./localauth.guard");
const passport_1 = require("@nestjs/passport");
const register_dto_1 = require("./dto/register.dto");
const jwtauth_guard_1 = require("./jwtauth.guard");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async getLogin(req) {
        return this.authService.formatResponse(req.user);
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async checkEmail(email) {
        const isEmailTaken = await this.authService.checkEmail(email);
        if (isEmailTaken) {
            throw new common_1.BadRequestException("이미 사용된 이메일입니다.");
        }
        return { message: "사용 가능한 이메일입니다." };
    }
    async checkNickName(nickName) {
        const isNickNameTaken = await this.authService.checkNickName(nickName);
        if (isNickNameTaken) {
            throw new common_1.BadRequestException("이미 사용된 닉네임입니다.");
        }
        return { message: "사용 가능한 닉네임입니다." };
    }
    async login(req) {
        return this.authService.login(req.user);
    }
    async kakaoLogin(res) {
        const KAKAO_CLIENT_ID = "170ea69c85667e150fa103eab9a19c35";
        const REDIRECT_URI = encodeURIComponent("http://localhost:5001/auth/callback/kakao");
        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
        res.redirect(kakaoAuthUrl);
    }
    async kakaoAuthRedirect(req, res) {
        const { accessToken, user } = await this.authService.login(req.user);
        const userStr = encodeURIComponent(JSON.stringify(user));
        const redirectUrl = `http://localhost:3000/auth/callback?token=${accessToken}&user=${userStr}`;
        res.redirect(redirectUrl);
    }
    async naverLogin(res) {
        const NAVER_CLIENT_ID = "CS8Gw4DSASCoHi8BhBmA";
        const REDIRECT_URI = encodeURIComponent("http://localhost:5001/auth/callback/naver");
        const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=email name nickname age birthday mobile`;
        res.redirect(naverAuthUrl);
    }
    async naverCallback(req, res) {
        const { accessToken, user } = await this.authService.login(req.user);
        const userStr = encodeURIComponent(JSON.stringify(user));
        const redirectUrl = `http://localhost:3000/auth/callback?token=${accessToken}&user=${userStr}`;
        res.redirect(redirectUrl);
    }
    async googleLogin() {
        return;
    }
    async googleCallback(req, res) {
        const { accessToken, user } = await this.authService.login(req.user);
        const userStr = encodeURIComponent(JSON.stringify(user));
        const redirectUrl = `http://localhost:3000/auth/callback?token=${accessToken}&user=${userStr}`;
        res.redirect(redirectUrl);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("login"),
    (0, swagger_1.ApiOperation)({
        summary: "로그인된 유저 정보",
        description: "JWT 토큰을 검증하고 유저 정보를 반환합니다.",
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getLogin", null);
__decorate([
    (0, common_1.Post)("register"),
    (0, swagger_1.ApiOperation)({
        summary: "로컬 회원가입",
        description: "이메일과 비밀번호로 로컬 회원을 등록합니다.",
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "회원가입 성공" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "잘못된 요청" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)("emailCheck"),
    (0, swagger_1.ApiOperation)({
        summary: "이메일 중복 확인",
        description: "이메일이 사용 중인지 확인합니다.",
    }),
    __param(0, (0, common_1.Body)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkEmail", null);
__decorate([
    (0, common_1.Post)("nicknameCheck"),
    (0, swagger_1.ApiOperation)({
        summary: "닉네임 중복 확인",
        description: "닉네임이 사용 중인지 확인합니다.",
    }),
    __param(0, (0, common_1.Body)("nickName")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkNickName", null);
__decorate([
    (0, common_1.UseGuards)(localauth_guard_1.LocalAuthGuard),
    (0, common_1.Post)("local"),
    (0, swagger_1.ApiOperation)({
        summary: "로컬 로그인",
        description: "이메일과 비밀번호로 로그인합니다.",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "로그인 성공" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "인증 실패" }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)("kakao"),
    (0, swagger_1.ApiOperation)({
        summary: "카카오 로그인",
        description: "카카오 로그인 페이지로 리디렉트합니다.",
    }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "kakaoLogin", null);
__decorate([
    (0, common_1.Get)("callback/kakao"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("kakao")),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "kakaoAuthRedirect", null);
__decorate([
    (0, common_1.Get)("naver"),
    (0, swagger_1.ApiOperation)({
        summary: "네이버 로그인",
        description: "네이버 로그인 페이지로 리디렉트합니다.",
    }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "naverLogin", null);
__decorate([
    (0, common_1.Get)("callback/naver"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("naver")),
    (0, swagger_1.ApiOperation)({
        summary: "네이버 로그인 콜백",
        description: "네이버 로그인 후 JWT 발급",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "naverCallback", null);
__decorate([
    (0, common_1.Get)("google"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("google")),
    (0, swagger_1.ApiOperation)({
        summary: "구글 로그인",
        description: "구글 로그인 페이지로 리디렉트됩니다.",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleLogin", null);
__decorate([
    (0, common_1.Get)("callback/google"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("google")),
    (0, swagger_1.ApiOperation)({
        summary: "구글 로그인 콜백",
        description: "구글 로그인 후 JWT 발급",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleCallback", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)("Auth"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map