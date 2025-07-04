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
const emailchech_dto_1 = require("./dto/emailchech.dto");
const jwtauth_guard_1 = require("./jwtauth.guard");
const user_service_1 = require("../users/user.service");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mail_service_1 = require("../mail/mail.service");
let AuthController = class AuthController {
    authService;
    userService;
    mailService;
    constructor(authService, userService, mailService) {
        this.authService = authService;
        this.userService = userService;
        this.mailService = mailService;
    }
    async getProfile(req) {
        const user = await this.userService.findById(req.user.id);
        return { user };
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async checkEmail(emailCheckDto) {
        const { email } = emailCheckDto;
        const isEmailTaken = await this.authService.checkEmail(email);
        if (isEmailTaken) {
            throw new common_1.BadRequestException({
                success: false,
                message: "이미 사용된 이메일입니다.",
            });
        }
        return {
            success: true,
            message: "사용 가능한 이메일입니다.",
        };
    }
    async checkNickname(nickName) {
        const isNickNameTaken = await this.authService.checkNickName(nickName);
        if (isNickNameTaken) {
            throw new common_1.BadRequestException({
                success: false,
                message: "이미 사용 중인 닉네임입니다.",
            });
        }
        return {
            success: true,
            message: "사용 가능한 닉네임입니다.",
        };
    }
    async checkNicknameForEdit(req, nickName) {
        const user = await this.userService.findById(req.user.id);
        if (!user) {
            throw new common_1.NotFoundException("사용자를 찾을 수 없습니다.");
        }
        if (user.nickname === nickName) {
            return { message: "현재 사용 중인 닉네임입니다.", available: true };
        }
        const isTaken = await this.authService.checkNickName(nickName);
        if (isTaken) {
            throw new common_1.BadRequestException("이미 사용 중인 닉네임입니다.");
        }
        return { message: "사용 가능한 닉네임입니다.", available: true };
    }
    async login(req, res) {
        const { accessToken, user } = await this.authService.login(req.user);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({ user });
    }
    logout(res) {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
        return res.json({ message: "로그아웃 되었습니다." });
    }
    async kakaoLogin(res) {
        const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
        const REDIRECT_URI = encodeURIComponent("http://localhost:5001/auth/callback/kakao");
        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
        res.redirect(kakaoAuthUrl);
    }
    async kakaoCallback(req, res) {
        const { accessToken, user } = await this.authService.login(req.user);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.redirect("http://localhost:3000/auth/callback");
    }
    async naverLogin(res) {
        const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
        const REDIRECT_URI = encodeURIComponent("http://localhost:5001/auth/callback/naver");
        const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=email name nickname age birthday mobile`;
        res.redirect(naverAuthUrl);
    }
    async naverCallback(req, res) {
        const { accessToken } = await this.authService.login(req.user);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.redirect("http://localhost:3000/auth/callback");
    }
    async googleLogin() {
        return;
    }
    async googleCallback(req, res) {
        const { accessToken } = await this.authService.login(req.user);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.redirect("http://localhost:3000/auth/callback");
    }
    async findIdByPhone(phone) {
        const user = await this.userService.findByPhone(phone);
        if (!user) {
            throw new common_1.NotFoundException("일치하는 유저를 찾을 수 없습니다.");
        }
        return { id: user.email };
    }
    async findPassword(body) {
        const user = await this.userService.findByEmail(body.email);
        if (!user) {
            return { message: "User not found", data: null };
        }
        return { message: "User found", data: user.email };
    }
    async updatePassword(body) {
        const user = await this.userService.findByEmail(body.email);
        if (!user) {
            return { message: "User not found" };
        }
        const hashedPassword = await bcrypt.hash(body.password, 10);
        user.password = hashedPassword;
        await this.userService.save(user);
        return { message: "Password updated successfully" };
    }
    async forgotPassword(email) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new common_1.BadRequestException("존재하지 않는 이메일입니다.");
        }
        const token = jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        await this.mailService.sendPasswordResetEmail(email, token);
        return { message: "비밀번호 재설정 메일을 전송했습니다." };
    }
    async resetPassword(body) {
        try {
            const payload = jwt.verify(body.token, process.env.JWT_REFRESH_SECRET);
            const user = await this.userService.findByEmail(payload.email);
            if (!user)
                throw new common_1.NotFoundException("유저를 찾을 수 없습니다.");
            const hashedPassword = await bcrypt.hash(body.newPassword, 10);
            user.password = hashedPassword;
            await this.userService.save(user);
            return { message: "비밀번호가 성공적으로 변경되었습니다." };
        }
        catch {
            throw new common_1.BadRequestException("토큰이 유효하지 않거나 만료되었습니다.");
        }
    }
    async updatePasswordPage(token) {
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            const user = await this.userService.findByEmail(payload.email);
            if (!user) {
                throw new common_1.NotFoundException("유저를 찾을 수 없습니다.");
            }
            return {
                message: "비밀번호를 변경할 수 있는 페이지입니다.",
                userId: user.id,
            };
        }
        catch {
            throw new common_1.BadRequestException("유효하지 않거나 만료된 토큰입니다.");
        }
    }
    async adminLogin(req, res) {
        const { accessToken, user } = await this.authService.login(req.user);
        if (user.user_type !== "admin") {
            throw new common_1.UnauthorizedException("관리자 권한이 없습니다.");
        }
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({ user });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)("login"),
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: "로그인된 유저 정보 조회",
        description: "JWT 토큰을 이용해 로그인한 유저의 정보를 반환합니다.",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "유저 정보 반환 성공" }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)("register"),
    (0, swagger_1.ApiOperation)({
        summary: "로컬 회원가입",
        description: "이메일과 비밀번호로 새로운 유저를 등록합니다.",
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
        description: "입력한 이메일이 이미 사용 중인지 확인합니다.",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "사용 가능 여부 반환" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [emailchech_dto_1.EmailCheckDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkEmail", null);
__decorate([
    (0, common_1.Post)("nicknameCheck"),
    (0, swagger_1.ApiOperation)({
        summary: "닉네임 중복 확인",
        description: "입력한 닉네임이 이미 사용 중인지 확인합니다.",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "사용 가능 여부 반환" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "닉네임 중복" }),
    __param(0, (0, common_1.Body)("nickName")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkNickname", null);
__decorate([
    (0, common_1.Post)("nicknameCheck/edit"),
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: "닉네임 중복 확인 (내 정보 수정)",
        description: "입력한 닉네임이 이미 사용 중인지 확인합니다. 현재 유저의 닉네임은 예외 처리됩니다.",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "사용 가능 여부 반환" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)("nickName")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkNicknameForEdit", null);
__decorate([
    (0, common_1.UseGuards)(localauth_guard_1.LocalAuthGuard),
    (0, common_1.Post)("local"),
    (0, swagger_1.ApiOperation)({
        summary: "로컬 로그인",
        description: "이메일과 비밀번호를 통한 로그인 처리",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "로그인 성공" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "인증 실패" }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("logout"),
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: "로그아웃",
        description: "JWT 쿠키를 삭제하여 로그아웃 처리합니다.",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "로그아웃 성공" }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)("kakao"),
    (0, swagger_1.ApiOperation)({
        summary: "카카오 로그인 요청",
        description: "카카오 로그인 인증 페이지로 리디렉트합니다.",
    }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "kakaoLogin", null);
__decorate([
    (0, common_1.Get)("callback/kakao"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("kakao")),
    (0, swagger_1.ApiOperation)({
        summary: "카카오 로그인 콜백",
        description: "카카오 로그인 성공 후 JWT 발급, 쿠키 저장, 클라이언트로 리디렉트",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "kakaoCallback", null);
__decorate([
    (0, common_1.Get)("naver"),
    (0, swagger_1.ApiOperation)({
        summary: "네이버 로그인 요청",
        description: "네이버 로그인 인증 페이지로 리디렉트합니다.",
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
        description: "JWT 발급 후 쿠키에 저장하고 클라이언트로 리디렉트",
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
        summary: "구글 로그인 요청",
        description: "구글 로그인 인증 페이지로 리디렉트합니다.",
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
        description: "JWT 발급 후 쿠키에 저장하고 클라이언트로 리디렉트",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleCallback", null);
__decorate([
    (0, common_1.Get)("findid"),
    (0, swagger_1.ApiOperation)({
        summary: "전화번호로 ID 찾기",
        description: "입력한 전화번호와 일치하는 이메일을 반환합니다.",
    }),
    (0, swagger_1.ApiQuery)({ name: "phone", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "ID 반환 성공" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "유저를 찾을 수 없음" }),
    __param(0, (0, common_1.Query)("phone")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "findIdByPhone", null);
__decorate([
    (0, common_1.Post)("findpw"),
    (0, swagger_1.ApiOperation)({
        summary: "비밀번호 찾기",
        description: "이메일로 유저가 존재하는지 확인합니다.",
    }),
    (0, swagger_1.ApiBody)({ schema: { properties: { email: { type: "string" } } } }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "findPassword", null);
__decorate([
    (0, common_1.Post)("updatePw"),
    (0, swagger_1.ApiOperation)({
        summary: "비밀번호 변경",
        description: "새 비밀번호로 유저 비밀번호를 변경합니다.",
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                email: { type: "string" },
                password: { type: "string", format: "password" },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Post)("forgot-password"),
    (0, swagger_1.ApiOperation)({
        summary: "비밀번호 재설정 메일 전송",
        description: "입력된 이메일로 비밀번호 재설정 메일을 전송합니다.",
    }),
    (0, swagger_1.ApiBody)({ schema: { properties: { email: { type: "string" } } } }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "메일 전송 성공" }),
    __param(0, (0, common_1.Body)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)("reset-password"),
    (0, swagger_1.ApiOperation)({
        summary: "비밀번호 재설정",
        description: "토큰을 기반으로 새 비밀번호를 설정합니다.",
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                token: { type: "string" },
                newPassword: { type: "string", format: "password" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "비밀번호 재설정 성공" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "유효하지 않거나 만료된 토큰" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)("update-password"),
    (0, swagger_1.ApiOperation)({
        summary: "비밀번호 변경 페이지",
        description: "사용자가 비밀번호를 변경할 수 있는 페이지입니다.",
    }),
    (0, swagger_1.ApiQuery)({ name: "token", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "페이지 접근 성공" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "유효하지 않은 토큰" }),
    __param(0, (0, common_1.Query)("token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updatePasswordPage", null);
__decorate([
    (0, common_1.UseGuards)(localauth_guard_1.LocalAuthGuard),
    (0, common_1.Post)("admin/login"),
    (0, swagger_1.ApiOperation)({
        summary: "관리자 로그인",
        description: "관리자 이메일과 비밀번호를 통한 로그인 처리",
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                email: { type: "string" },
                password: { type: "string", format: "password" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "로그인 성공" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "인증 실패 또는 관리자 아님" }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "adminLogin", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)("Auth"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService,
        mail_service_1.MailService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map