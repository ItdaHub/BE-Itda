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
    async register(registerDto) {
        const { email, password, nickname, type } = registerDto;
        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
        const user = this.entityManager.create(user_entity_1.User, {
            email,
            password: hashedPassword,
            nickname,
            type: type || user_entity_2.LoginType.LOCAL,
        });
        await this.entityManager.save(user);
        return this.formatResponse(user);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.EntityManager,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map