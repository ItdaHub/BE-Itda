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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const user_entity_2 = require("../users/user.entity");
let AuthService = class AuthService {
    entityManager;
    jwtService;
    constructor(entityManager, jwtService) {
        this.entityManager = entityManager;
        this.jwtService = jwtService;
    }
    async validateKakaoUser(profile) {
        let user = await this.entityManager.findOne(user_entity_1.User, {
            where: { email: profile._json.kakao_account.email },
        });
        if (!user) {
            user = await this.register({
                email: profile._json.kakao_account.email,
                nickname: profile.username,
                type: user_entity_2.LoginType.KAKAO,
                password: null,
            });
        }
        return user;
    }
    async validateNaverUser(profile) {
        let user = await this.entityManager.findOne(user_entity_1.User, {
            where: { email: profile.email },
        });
        if (!user) {
            user = await this.register({
                email: profile.email,
                nickname: profile.nickname,
                type: user_entity_2.LoginType.NAVER,
                password: null,
            });
        }
        return user;
    }
    async validateGoogleUser(profile) {
        let user = await this.entityManager.findOne(user_entity_1.User, {
            where: { email: profile.emails[0].value },
        });
        if (!user) {
            user = await this.register({
                email: profile.emails[0].value,
                nickname: profile.displayName,
                type: user_entity_2.LoginType.GOOGLE,
                password: null,
            });
        }
        return user;
    }
    calculateAge(birthDate) {
        if (!birthDate)
            return undefined;
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }
    async register(registerDto) {
        const { email, password, nickname, birthDate, type } = registerDto;
        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
        const age = this.calculateAge(birthDate);
        const user = this.entityManager.create(user_entity_1.User, {
            email,
            password: hashedPassword,
            nickname,
            age,
            type: type || user_entity_2.LoginType.LOCAL,
        });
        await this.entityManager.save(user);
        return user;
    }
    async validateUser(email, password) {
        const user = await this.entityManager.findOne(user_entity_1.User, { where: { email } });
        if (!user)
            throw new common_1.UnauthorizedException("이메일이 존재하지 않습니다.");
        if (!user.password)
            throw new common_1.UnauthorizedException("소셜 로그인 유저는 비밀번호를 사용할 수 없습니다.");
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            throw new common_1.UnauthorizedException("비밀번호가 틀렸습니다.");
        return user;
    }
    async login(user) {
        const payload = { id: user.id, email: user.email, nickname: user.nickname };
        return { access_token: this.jwtService.sign(payload) };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.EntityManager,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map