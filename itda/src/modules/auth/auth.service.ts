import { Injectable, UnauthorizedException } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { User } from "../users/user.entity";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { LoginType } from "../users/user.entity";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private entityManager: EntityManager,
    private jwtService: JwtService
  ) {}

  // 카카오 로그인
  async validateKakaoUser(profile: any) {
    let user = await this.entityManager.findOne(User, {
      where: { email: profile._json.kakao_account.email },
    });

    if (!user) {
      user = await this.register({
        email: profile._json.kakao_account.email,
        nickname: profile.username,
        type: LoginType.KAKAO,
        password: null, // 소셜 로그인은 비밀번호 없음
      });
    }

    return user;
  }

  // 네이버 로그인
  async validateNaverUser(profile: any) {
    let user = await this.entityManager.findOne(User, {
      where: { email: profile.email },
    });

    if (!user) {
      user = await this.register({
        email: profile.email,
        nickname: profile.nickname,
        type: LoginType.NAVER,
        password: null,
      });
    }

    return user;
  }

  // 구글 로그인
  async validateGoogleUser(profile: any) {
    let user = await this.entityManager.findOne(User, {
      where: { email: profile.emails[0].value },
    });

    if (!user) {
      user = await this.register({
        email: profile.emails[0].value,
        nickname: profile.displayName,
        type: LoginType.GOOGLE,
        password: null,
      });
    }

    return user;
  }

  // 나이 계산 함수
  private calculateAge(birthDate?: string): number | undefined {
    if (!birthDate) return undefined;

    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  }

  // 회원가입 (로컬 및 소셜 회원가입 지원)
  async register(registerDto: RegisterDto): Promise<User> {
    const { email, password, nickname, birthDate, type } = registerDto;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null; // 비밀번호가 없으면 null 저장
    const age = this.calculateAge(birthDate); // undefined 처리

    const user = this.entityManager.create(User, {
      email,
      password: hashedPassword,
      nickname,
      age,
      type: type || LoginType.LOCAL, // 기본값 설정
    });

    await this.entityManager.save(user);
    return user;
  }

  // 로컬 로그인
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

    return user;
  }

  // JWT 토큰 생성
  async login(user: User) {
    const payload = { id: user.id, email: user.email, nickname: user.nickname };
    return { access_token: this.jwtService.sign(payload) };
  }
}
