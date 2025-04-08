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
exports.NaverStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_naver_1 = require("passport-naver");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const config_1 = require("@nestjs/config");
const agegroup_util_1 = require("./utils/agegroup.util");
let NaverStrategy = class NaverStrategy extends (0, passport_1.PassportStrategy)(passport_naver_1.Strategy, "naver") {
    authService;
    constructor(authService, configService) {
        super({
            clientID: configService.get("NAVER_CLIENT_ID", ""),
            clientSecret: configService.get("NAVER_CLIENT_SECRET", ""),
            callbackURL: configService.get("NAVER_CALLBACK_URL", ""),
            scope: ["name", "email", "nickname", "mobile", "birthyear"],
        });
        this.authService = authService;
        console.log("네이버 로그인 설정 완료 ✅");
    }
    async validate(accessToken, refreshToken, profile) {
        const email = profile?.email || profile._json?.email;
        const name = profile?.name || profile.displayName;
        const nickname = profile.nickname || email?.split("@")[0];
        const phone = profile.mobile || profile._json?.mobile;
        const ageStr = profile._json?.age;
        const age_group = (0, agegroup_util_1.convertNaverAgeToGroup)(ageStr) ?? undefined;
        console.log("✅ 변환된 age_group:", age_group);
        const birthYear = profile._json?.birthyear;
        if (!email) {
            console.error("❌ 이메일이 없습니다.");
            throw new Error("이메일이 없습니다.");
        }
        const user = await this.authService.validateNaverUser({
            email,
            name,
            nickname,
            phone,
            age_group,
            birthYear,
        });
        return user;
    }
};
exports.NaverStrategy = NaverStrategy;
exports.NaverStrategy = NaverStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService])
], NaverStrategy);
//# sourceMappingURL=naver.strategy.js.map