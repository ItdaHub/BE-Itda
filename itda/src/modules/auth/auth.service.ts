import { Injectable, UnauthorizedException } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { User } from "../users/user.entity";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { LoginType, UserStatus } from "../users/user.entity";
import { RegisterDto } from "./dto/register.dto";
import { CreateUserDto } from "../users/dto/ceateuser.dto";

@Injectable()
export class AuthService {
  constructor(
    private entityManager: EntityManager,
    private jwtService: JwtService
  ) {}

  // ✅ 공통 토큰 생성 함수
  private createToken(user: User) {
    const payload = { id: user.id, email: user.email, type: user.type };
    return this.jwtService.sign(payload);
  }

  // ✅ 공통 응답 포맷 함수
  public formatResponse(user: User) {
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

  // ✅ 로그인 시 JWT 토큰 생성
  async login(user: User) {
    const payload = { id: user.id, email: user.email, nickname: user.nickname };

    return {
      token: this.jwtService.sign(payload),
      user,
    };
  }

  // ✅ 카카오 로그인
  async validateKakaoUser({
    email,
    nickname,
  }: {
    email: string;
    nickname: string;
  }) {
    if (!email) throw new Error("이메일이 없습니다.");

    let user = await this.entityManager.findOne(User, { where: { email } });

    if (!user) {
      user = this.entityManager.create(User, {
        email,
        nickname,
        type: LoginType.KAKAO,
        password: "",
      });
      await this.entityManager.save(user);
    }

    return this.formatResponse(user);
  }

  // ✅ 네이버 로그인
  async validateNaverUser({
    email,
    name,
    nickname,
    birthYear,
    phone,
  }: {
    email: string;
    name?: string;
    nickname?: string;
    birthYear?: string;
    phone?: string;
  }) {
    let user: User | null = await this.entityManager.findOne(User, {
      where: { email },
    });

    if (!user) {
      const newUser = await this.register({
        email,
        nickname: nickname || email.split("@")[0],
        name: name,
        birthYear,
        phone,
        type: LoginType.NAVER,
        password: "",
      });

      user = newUser.user;
    }

    return this.formatResponse(user ?? new User());
  }

  // ✅ 구글 로그인
  async validateGoogleUser(profile: any) {
    console.log("📌 구글 프로필:", JSON.stringify(profile, null, 2));

    const email = profile.email || profile._json?.email || null;
    const name = profile.displayName || profile._json?.name || "익명"; // ✅ name 가져오기
    const nickname = email?.split("@")[0] || "익명";

    if (!email) {
      console.error("❌ 구글 프로필에서 이메일을 찾을 수 없습니다.");
      throw new Error("이메일이 없습니다.");
    }

    let user: User | null = await this.entityManager.findOne(User, {
      where: { email },
    });

    if (!user) {
      console.log("🆕 새로운 사용자 생성:", { email, name, nickname });
      const newUser = await this.register({
        email,
        name, // ✅ name 추가
        nickname,
        type: LoginType.GOOGLE,
        password: null,
      });

      user = newUser.user as User;
    } else {
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

  // ✅ 로컬 로그인
  async validateUser(email: string, password: string) {
    const user = await this.entityManager.findOne(User, { where: { email } });
    if (!user) throw new UnauthorizedException("이메일이 존재하지 않습니다.");

    if (!user.password)
      throw new UnauthorizedException(
        "소셜 로그인 유저는 비밀번호를 사용할 수 없습니다."
      );

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException("비밀번호가 틀렸습니다.");

    return this.formatResponse(user);
  }

  // ✅ 회원가입
  async register(userDto: CreateUserDto): Promise<{ user: User }> {
    console.log("🚀 회원 가입 요청:", userDto);

    const { email, name, nickname, type, password, status } = userDto;

    const newUser = this.entityManager.create(User, {
      email,
      name,
      nickname,
      type,
      password: password ? await bcrypt.hash(password, 10) : null,
      status: status || UserStatus.ACTIVE, // ✅ 기본값 설정
    });

    await this.entityManager.save(newUser);

    console.log("✅ 회원 가입 완료:", newUser);

    return { user: newUser };
  }
}
