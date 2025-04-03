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
exports.KakaoStrategy = void 0;
const passport_kakao_1 = require("passport-kakao");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
let KakaoStrategy = class KakaoStrategy extends (0, passport_1.PassportStrategy)(passport_kakao_1.Strategy, "kakao") {
    authService;
    constructor(authService, configService) {
        super({
            clientID: configService.get("KAKAO_CLIENT_ID", ""),
            clientSecret: configService.get("KAKAO_CLIENT_SECRET", ""),
            callbackURL: configService.get("KAKAO_CALLBACK_URL", ""),
        });
        this.authService = authService;
        console.log("카카오 로그인 설정 완료 ✅");
    }
    async validate(accessToken, refreshToken, profile) {
        console.log("📌 카카오 프로필:", profile);
        const kakaoData = profile._json || JSON.parse(profile._raw || "{}");
        console.log("📌 profile._json 전체:", JSON.stringify(kakaoData, null, 2));
        const kakaoAccount = kakaoData.kakao_account;
        console.log("🟢 kakaoAccount:", JSON.stringify(kakaoAccount, null, 2));
        if (!kakaoAccount) {
            console.error("❌ 카카오 계정 정보가 없습니다.");
            throw new Error("카카오 계정 정보가 없습니다.");
        }
        const email = kakaoAccount?.email;
        const nickname = kakaoData?.properties?.nickname;
        if (!email) {
            console.error("❌ 이메일을 찾을 수 없습니다.");
            throw new Error("이메일이 없습니다.");
        }
        if (!nickname) {
            console.error("❌ 닉네임을 찾을 수 없습니다.");
            throw new Error("닉네임이 없습니다.");
        }
        console.log(`✅ 로그인 성공: ${nickname} (${email})`);
        return this.authService.validateKakaoUser({ email, nickname });
    }
};
exports.KakaoStrategy = KakaoStrategy;
exports.KakaoStrategy = KakaoStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService])
], KakaoStrategy);
//# sourceMappingURL=kakao.strategy.js.map