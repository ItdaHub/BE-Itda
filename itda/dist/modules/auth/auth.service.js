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
const class_transformer_1 = require("class-transformer");
const agegroup_util_1 = require("./utils/agegroup.util");
let AuthService = class AuthService {
    entityManager;
    jwtService;
    constructor(entityManager, jwtService) {
        this.entityManager = entityManager;
        this.jwtService = jwtService;
    }
    createToken(user) {
        const payload = { id: user.id, email: user.email, type: user.type };
        console.log("🧪 JWT payload:", payload);
        return this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: "7d",
        });
    }
    async formatResponse(partialUser) {
        const user = await this.entityManager.findOne(user_entity_1.User, {
            where: { id: partialUser.id },
            relations: [
                "payments",
                "novels",
                "participants",
                "chapters",
                "comments",
                "likes",
                "reports",
                "notifications",
                "votes",
                "points",
            ],
        });
        if (!user) {
            throw new Error("유저를 찾을 수 없습니다.");
        }
        const plainUser = (0, class_transformer_1.instanceToPlain)(user);
        console.log("📦 변환된 전체 user 정보:", plainUser);
        return {
            accessToken: this.createToken(user),
            user: plainUser,
        };
    }
    async login(user) {
        return this.formatResponse(user);
    }
    async validateKakaoUser({ email, nickname, birthYear, }) {
        if (!email)
            throw new Error("이메일이 없습니다.");
        let user = await this.entityManager.findOne(user_entity_1.User, {
            where: { email, type: user_entity_2.LoginType.KAKAO },
        });
        if (!user) {
            const isDuplicate = await this.checkNickName(nickname);
            const fallbackNickname = isDuplicate ? email.split("@")[0] : nickname;
            const age_group = birthYear
                ? ((0, agegroup_util_1.convertBirthYearToAgeGroup)(birthYear) ?? undefined)
                : undefined;
            user = (await this.register({
                email,
                name: fallbackNickname,
                nickname: fallbackNickname,
                birthYear,
                type: user_entity_2.LoginType.KAKAO,
                password: "",
                age_group,
            })).user;
        }
        return user;
    }
    async validateNaverUser({ email, name, nickname, birthYear, phone, age_group, }) {
        console.log("🟡 네이버 로그인 요청 데이터:", {
            email,
            name,
            nickname,
            birthYear,
            phone,
            age_group,
        });
        if (!email)
            throw new Error("이메일이 없습니다.");
        let user = await this.entityManager.findOne(user_entity_1.User, {
            where: { email, type: user_entity_2.LoginType.NAVER },
        });
        if (!user) {
            const baseNickname = nickname || email.split("@")[0];
            const isDuplicate = await this.checkNickName(baseNickname);
            const finalNickname = isDuplicate ? email.split("@")[0] : baseNickname;
            user = (await this.register({
                email,
                nickname: finalNickname,
                name: name || finalNickname,
                birthYear,
                phone,
                age_group,
                type: user_entity_2.LoginType.NAVER,
                password: "",
            })).user;
        }
        return user;
    }
    async validateGoogleUser({ email, nickname, birthYear, }) {
        if (!email)
            throw new Error("이메일이 없습니다.");
        let user = await this.entityManager.findOne(user_entity_1.User, {
            where: { email, type: user_entity_2.LoginType.GOOGLE },
        });
        if (!user) {
            const isDuplicate = await this.checkNickName(nickname);
            const fallbackNickname = isDuplicate ? email.split("@")[0] : nickname;
            const age_group = birthYear
                ? ((0, agegroup_util_1.convertBirthYearToAgeGroup)(birthYear) ?? undefined)
                : undefined;
            user = (await this.register({
                email,
                name: fallbackNickname,
                nickname: fallbackNickname,
                birthYear,
                type: user_entity_2.LoginType.GOOGLE,
                password: "",
                age_group,
            })).user;
        }
        return user;
    }
    async validateUser(email, password) {
        const user = await this.entityManager.findOne(user_entity_1.User, {
            where: { email },
            select: ["id", "email", "password", "type", "nickname", "status"],
        });
        console.log("✅ 가져온 user:", user);
        if (!user) {
            console.log("❌ 이메일 없음:", email);
            throw new common_1.UnauthorizedException("이메일이 존재하지 않습니다.");
        }
        if (!user.password || user.password.trim() === "") {
            console.log("❌ 소셜 로그인 유저:", email);
            throw new common_1.UnauthorizedException("소셜 로그인 유저는 비밀번호를 사용할 수 없습니다.");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("❌ 비밀번호 틀림:", email);
            throw new common_1.UnauthorizedException("비밀번호가 틀렸습니다.");
        }
        return user;
    }
    async register(userDto) {
        console.log("🚀 회원 가입 요청:", userDto);
        console.log("📌 age_group in register:", userDto.age_group);
        const { email, name, password, birthYear, phone, type } = userDto;
        const emailUser = await this.entityManager.findOne(user_entity_1.User, {
            where: { email, type },
        });
        if (emailUser)
            throw new Error("이미 사용 중인 이메일입니다.");
        const baseNickname = userDto.nickname || email.split("@")[0];
        let nickname = baseNickname;
        let suffix = 1;
        while (await this.entityManager.findOne(user_entity_1.User, {
            where: { nickname, type },
        })) {
            nickname = `${baseNickname}${suffix}`;
            suffix++;
        }
        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
        const newUser = this.entityManager.create(user_entity_1.User, {
            email,
            name: name || "사용자",
            nickname,
            birthYear,
            phone,
            type: type ?? user_entity_2.LoginType.LOCAL,
            password: hashedPassword,
            status: user_entity_2.UserStatus.ACTIVE,
            age_group: userDto.age_group,
        });
        await this.entityManager.save(newUser);
        console.log("✅ 회원 가입 완료:", newUser);
        return { user: newUser };
    }
    async checkEmail(email) {
        const user = await this.entityManager.findOne(user_entity_1.User, { where: { email } });
        return !!user;
    }
    async checkNickName(nickname) {
        const user = await this.entityManager.findOne(user_entity_1.User, {
            where: { nickname },
        });
        return !!user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.EntityManager,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map