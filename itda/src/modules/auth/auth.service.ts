import { Injectable, UnauthorizedException } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { User } from "../users/user.entity";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { LoginType, UserStatus } from "../users/user.entity";
import { RegisterDto } from "./dto/register.dto";
import { instanceToPlain } from "class-transformer";
import { calculateAge } from "../users/utils/user.util";

// 회원가입 시 나이 계산해서 저장(추가 할거면 하기)
//const birthYear = userDto.birthYear;
// const age = birthYear ? calculateAge(birthYear) : 0;

// const newUser = this.entityManager.create(User, {
//   // ...
//   birthYear,
//   age, // 여기 추가!
// });

// 같은 이메일로 로그인 했을때 타입이 다르면 로그인 가능

// ✅ 타입 선언 추가
type LoginResponse = {
  accessToken: string;
  user: Record<string, any>;
};

@Injectable()
export class AuthService {
  constructor(
    private entityManager: EntityManager,
    private jwtService: JwtService
  ) {}

  // ✅ 공통 토큰 생성 함수
  private createToken(user: User): string {
    const payload = { id: user.id, email: user.email, type: user.type };
    console.log("🧪 JWT payload:", payload);
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: "1h",
    });
  }

  // ✅ 공통 응답 포맷 함수 (타입 지정)
  public formatResponse(user: User): LoginResponse {
    const plainUser = instanceToPlain(user);
    console.log("📦 변환된 user 객체:", plainUser);

    return {
      accessToken: this.createToken(user),
      user: plainUser,
    };
  }

  // ✅ 로그인 (타입 지정)
  async login(user: User): Promise<LoginResponse> {
    return this.formatResponse(user);
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

    let user = await this.entityManager.findOne(User, {
      where: { email, type: LoginType.KAKAO },
    });

    if (!user) {
      user = this.entityManager.create(User, {
        email,
        nickname,
        type: LoginType.KAKAO,
        password: "",
        status: UserStatus.ACTIVE,
      });
      await this.entityManager.save(user);
    }

    return user;
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
    let user = await this.entityManager.findOne(User, {
      where: { email, type: LoginType.NAVER },
    });

    if (!user) {
      user = (
        await this.register({
          email,
          nickname: nickname || email.split("@")[0],
          name: name || "사용자",
          birthYear,
          phone,
          type: LoginType.NAVER,
          password: "",
        })
      ).user;
    }

    return user;
  }

  // ✅ 구글 로그인
  async validateGoogleUser({
    email,
    nickname,
  }: {
    email: string;
    nickname: string;
  }) {
    let user = await this.entityManager.findOne(User, {
      where: { email, type: LoginType.GOOGLE },
    });

    if (!user) {
      user = (
        await this.register({
          email,
          name: nickname,
          nickname,
          type: LoginType.GOOGLE,
          password: "",
        })
      ).user;
    }

    return user;
  }

  // ✅ 로컬 로그인 (타입 지정)
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.entityManager.findOne(User, {
      where: { email },
      select: ["id", "email", "password", "type", "nickname", "status"],
    });
    console.log("✅ 가져온 user:", user);

    if (!user) {
      console.log("❌ 이메일 없음:", email);
      throw new UnauthorizedException("이메일이 존재하지 않습니다.");
    }

    if (!user.password || user.password.trim() === "") {
      console.log("❌ 소셜 로그인 유저:", email);
      throw new UnauthorizedException(
        "소셜 로그인 유저는 비밀번호를 사용할 수 없습니다."
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("❌ 비밀번호 틀림:", email);
      throw new UnauthorizedException("비밀번호가 틀렸습니다.");
    }

    return user;
  }

  // ✅ 회원가입
  async register(userDto: RegisterDto): Promise<{ user: User }> {
    console.log("🚀 회원 가입 요청:", userDto);

    const { email, name, nickname, password, birthYear, phone, type } = userDto;

    const emailUser = await this.entityManager.findOne(User, {
      where: { email, type },
    });

    if (emailUser) throw new Error("이미 사용 중인 이메일입니다.");

    const nicknameUser = await this.entityManager.findOne(User, {
      where: { nickname },
    });

    if (nicknameUser) throw new Error("이미 사용 중인 닉네임입니다.");

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const newUser = this.entityManager.create(User, {
      email,
      name: name || "사용자",
      nickname: nickname || email.split("@")[0],
      birthYear,
      phone,
      type: type ?? LoginType.LOCAL,
      password: hashedPassword,
      status: UserStatus.ACTIVE,
    });

    await this.entityManager.save(newUser);

    console.log("✅ 회원 가입 완료:", newUser);

    return { user: newUser };
  }

  async checkEmail(email: string): Promise<boolean> {
    const user = await this.entityManager.findOne(User, { where: { email } });
    return !!user;
  }

  async checkNickName(nickname: string): Promise<boolean> {
    const user = await this.entityManager.findOne(User, {
      where: { nickname },
    });
    return !!user;
  }
}
