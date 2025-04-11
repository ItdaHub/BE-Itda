import { Injectable, UnauthorizedException } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { User } from "../users/user.entity";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { LoginType, UserStatus } from "../users/user.entity";
import { RegisterDto } from "./dto/register.dto";
import { instanceToPlain } from "class-transformer";
import {
  convertBirthYearToAgeGroup,
  convertNaverAgeToGroup,
} from "./utils/agegroup.util";

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
      expiresIn: "7d",
    });
  }

  // ✅ 공통 응답 포맷 함수 (타입 지정)
  public async formatResponse(partialUser: User): Promise<LoginResponse> {
    const user = await this.entityManager.findOne(User, {
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

    const plainUser = instanceToPlain(user);
    console.log("📦 변환된 전체 user 정보:", plainUser);

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
    birthYear,
  }: {
    email: string;
    nickname: string;
    birthYear?: string;
  }) {
    if (!email) throw new Error("이메일이 없습니다.");

    let user = await this.entityManager.findOne(User, {
      where: { email, type: LoginType.KAKAO },
    });

    if (!user) {
      const isDuplicate = await this.checkNickName(nickname);
      const fallbackNickname = isDuplicate ? email.split("@")[0] : nickname;

      const age_group = birthYear
        ? (convertBirthYearToAgeGroup(birthYear) ?? undefined)
        : undefined;

      user = (
        await this.register({
          email,
          name: fallbackNickname,
          nickname: fallbackNickname,
          birthYear,
          type: LoginType.KAKAO,
          password: "",
          age_group, // 👈 추가
        })
      ).user;
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
    age_group,
  }: {
    email: string;
    name?: string;
    nickname?: string;
    birthYear?: string;
    phone?: string;
    age_group?: number; // ✅ 숫자로 수정
  }) {
    console.log("🟡 네이버 로그인 요청 데이터:", {
      email,
      name,
      nickname,
      birthYear,
      phone,
      age_group,
    });

    if (!email) throw new Error("이메일이 없습니다.");

    let user = await this.entityManager.findOne(User, {
      where: { email, type: LoginType.NAVER },
    });

    if (!user) {
      const baseNickname = nickname || email.split("@")[0];
      const isDuplicate = await this.checkNickName(baseNickname);
      const finalNickname = isDuplicate ? email.split("@")[0] : baseNickname;

      user = (
        await this.register({
          email,
          nickname: finalNickname,
          name: name || finalNickname,
          birthYear,
          phone,
          age_group, // ✅ 숫자 그대로 전달
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
    birthYear,
  }: {
    email: string;
    nickname: string;
    birthYear?: string;
  }) {
    if (!email) throw new Error("이메일이 없습니다.");

    let user = await this.entityManager.findOne(User, {
      where: { email, type: LoginType.GOOGLE },
    });

    if (!user) {
      const isDuplicate = await this.checkNickName(nickname);
      const fallbackNickname = isDuplicate ? email.split("@")[0] : nickname;

      const age_group = birthYear
        ? (convertBirthYearToAgeGroup(birthYear) ?? undefined)
        : undefined;

      user = (
        await this.register({
          email,
          name: fallbackNickname,
          nickname: fallbackNickname,
          birthYear,
          type: LoginType.GOOGLE,
          password: "",
          age_group, // 👈 추가
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

    // 👇 여기서 명확하게 찍어줘
    console.log("📌 age_group in register:", userDto.age_group);

    const { email, name, password, birthYear, phone, type } = userDto;

    const emailUser = await this.entityManager.findOne(User, {
      where: { email, type },
    });

    if (emailUser) throw new Error("이미 사용 중인 이메일입니다.");

    // ✅ 닉네임 자동 처리
    const baseNickname = userDto.nickname || email.split("@")[0];
    let nickname = baseNickname;
    let suffix = 1;

    while (
      await this.entityManager.findOne(User, {
        where: { nickname, type },
      })
    ) {
      nickname = `${baseNickname}${suffix}`;
      suffix++;
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const newUser = this.entityManager.create(User, {
      email,
      name: name || "사용자",
      nickname,
      birthYear,
      phone,
      type: type ?? LoginType.LOCAL,
      password: hashedPassword,
      status: UserStatus.ACTIVE,
      age_group: userDto.age_group,
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
