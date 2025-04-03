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
    createToken(user) {
        const payload = { id: user.id, email: user.email, type: user.type };
        return this.jwtService.sign(payload);
    }
    formatResponse(user) {
        return {
            token: this.createToken(user),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                profile_img: user.profile_img,
                phone: user.phone,
                type: user.type,
                nickname: user.nickname,
                age: user.age,
                created_at: user.created_at,
                user_type: user.user_type,
            },
        };
    }
    async login(user) {
        const payload = { id: user.id, email: user.email, nickname: user.nickname };
        return {
            token: this.jwtService.sign(payload),
            user,
        };
    }
    async validateKakaoUser({ email, nickname, }) {
        if (!email)
            throw new Error("이메일이 없습니다.");
        let user = await this.entityManager.findOne(user_entity_1.User, { where: { email } });
        if (!user) {
            user = this.entityManager.create(user_entity_1.User, {
                email,
                nickname,
                type: user_entity_2.LoginType.KAKAO,
                password: "",
            });
            await this.entityManager.save(user);
        }
        return this.formatResponse(user);
    }
    async validateNaverUser({ email, name, nickname, birthYear, phone, }) {
        let user = await this.entityManager.findOne(user_entity_1.User, {
            where: { email },
        });
        if (!user) {
            const newUser = await this.register({
                email,
                nickname: nickname || email.split("@")[0],
                name: name,
                birthYear,
                phone,
                type: user_entity_2.LoginType.NAVER,
                password: "",
            });
            user = newUser.user;
        }
        return this.formatResponse(user ?? new user_entity_1.User());
    }
    async validateGoogleUser(profile) {
        console.log("📌 구글 프로필:", JSON.stringify(profile, null, 2));
        const email = profile.email || profile._json?.email || null;
        const name = profile.displayName || profile._json?.name || "익명";
        const nickname = email?.split("@")[0] || "익명";
        if (!email) {
            console.error("❌ 구글 프로필에서 이메일을 찾을 수 없습니다.");
            throw new Error("이메일이 없습니다.");
        }
        let user = await this.entityManager.findOne(user_entity_1.User, {
            where: { email },
        });
        if (!user) {
            console.log("🆕 새로운 사용자 생성:", { email, name, nickname });
            const newUser = await this.register({
                email,
                name,
                nickname,
                type: user_entity_2.LoginType.GOOGLE,
                password: null,
            });
            user = newUser.user;
        }
        else {
            console.log("✅ 기존 사용자 발견:", user);
            if (!user.name) {
                console.log(`⚠️ 기존 사용자 name이 없습니다. 업데이트 진행: ${name}`);
                user.name = name;
                await this.entityManager.save(user);
            }
        }
        console.log("🔍 최종 저장된 사용자:", user);
        return this.formatResponse(user);
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
        return this.formatResponse(user);
    }
    async register(userDto) {
        console.log("🚀 회원 가입 요청:", userDto);
        const { email, name, nickname, type, password, status } = userDto;
        const newUser = this.entityManager.create(user_entity_1.User, {
            email,
            name,
            nickname,
            type,
            password: password ? await bcrypt.hash(password, 10) : null,
            status: status || user_entity_2.UserStatus.ACTIVE,
        });
        await this.entityManager.save(newUser);
        console.log("✅ 회원 가입 완료:", newUser);
        return { user: newUser };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.EntityManager,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map