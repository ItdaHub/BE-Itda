import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string) {
    // 이메일과 비밀번호로 유저를 검증
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new UnauthorizedException("Invalid credentials");
    return user;
  }
}
