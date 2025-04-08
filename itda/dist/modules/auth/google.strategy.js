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
exports.GoogleStrategy = void 0;
const passport_google_oauth20_1 = require("passport-google-oauth20");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const axios_1 = require("axios");
let GoogleStrategy = class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, "google") {
    authService;
    constructor(authService, configService) {
        super({
            clientID: configService.get("GOOGLE_CLIENT_ID", ""),
            clientSecret: configService.get("GOOGLE_CLIENT_SECRET", ""),
            callbackURL: configService.get("GOOGLE_CALLBACK_URL", ""),
            scope: [
                "email",
                "profile",
                "https://www.googleapis.com/auth/user.birthday.read",
            ],
        });
        this.authService = authService;
        console.log("구글 로그인 설정 완료 ✅");
    }
    async validate(accessToken, refreshToken, profile) {
        console.log("📌 구글 프로필:", profile);
        const email = Array.isArray(profile.emails) && profile.emails.length > 0
            ? profile.emails[0].value
            : profile._json?.email || null;
        const nickname = profile.displayName || profile._json?.name || email?.split("@")[0];
        if (!email) {
            console.error("❌ 이메일을 찾을 수 없습니다.");
            throw new Error("이메일이 없습니다.");
        }
        let birthYear = null;
        try {
            const peopleResponse = await axios_1.default.get("https://people.googleapis.com/v1/people/me", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    personFields: "birthdays",
                },
            });
            const birthdays = peopleResponse.data.birthdays;
            const birthDate = birthdays?.[0]?.date;
            if (birthDate?.year) {
                birthYear = String(birthDate.year);
                console.log("🎂 출생년도:", birthYear);
            }
            else {
                console.log("🎂 생일 정보 없음 (year 없음)");
            }
        }
        catch (err) {
            console.error("❌ 생일 정보 가져오기 실패:", err.response?.data || err);
        }
        const user = await this.authService.validateGoogleUser({
            email,
            nickname,
            birthYear: birthYear ?? undefined,
        });
        return user;
    }
};
exports.GoogleStrategy = GoogleStrategy;
exports.GoogleStrategy = GoogleStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService])
], GoogleStrategy);
//# sourceMappingURL=google.strategy.js.map