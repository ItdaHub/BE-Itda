import { Strategy } from "passport-kakao";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, "kakao") {
  constructor(private authService: AuthService) {
    super({
      clientID: "카카오 앱 클라이언트 아이디",
      clientSecret: "카카오 앱 클라이언트 시크릿 (선택)",
      callbackURL: "카카오 인증 콜백 URL",
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const user = await this.authService.validateKakaoUser(profile);
    return user;
  }
}
