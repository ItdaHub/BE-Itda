import { Strategy } from "passport-naver";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, "naver") {
  constructor(private authService: AuthService) {
    super({
      clientID: "네이버 앱 클라이언트 아이디",
      clientSecret: "네이버 앱 클라이언트 시크릿 (선택)",
      callbackURL: "네이버 인증 콜백 URL",
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const user = await this.authService.validateNaverUser(profile);
    return user;
  }
}
