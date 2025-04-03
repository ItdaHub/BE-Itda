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

  // ✅ 공통 토큰 생성 함수
  private createToken(user: User) {
    const payload = { id: user.id, email: user.email, type: user.type };
    return this.jwtService.sign(payload);
  }

  // ✅ 공통 응답 포맷 함수
  private formatResponse(user: User) {
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
  async register(
    registerDto: RegisterDto
  ): Promise<{ token: string; user: any }> {
    const { email, password, nickname, type } = registerDto;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const user = this.entityManager.create(User, {
      email,
      password: hashedPassword,
      nickname,
      type: type || LoginType.LOCAL,
    });

    await this.entityManager.save(user);
    return this.formatResponse(user);
  }
}
