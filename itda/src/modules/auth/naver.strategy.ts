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

// 소셜 로그인 한 후 아이디 비교 후 회원가입되어 있으면 jwt토큰 발급받아서 로그인
// 회원가입이 안되어 있으면 db에 바로 저장
