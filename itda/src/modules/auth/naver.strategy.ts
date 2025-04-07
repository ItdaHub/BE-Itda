import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-naver";
import { Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, "naver") {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService
  ) {
    super({
      clientID: configService.get<string>("NAVER_CLIENT_ID", ""),
      clientSecret: configService.get<string>("NAVER_CLIENT_SECRET", ""),
      callbackURL: configService.get<string>("NAVER_CALLBACK_URL", ""),
    });

    console.log("네이버 로그인 설정 완료 ✅");
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    console.log("📌 네이버 프로필:", profile);

    const email = profile?.email || profile._json?.email;
    const name = profile?.name || profile.displayName;
    const nickname = profile.nickname || email?.split("@")[0];
    const birthYear = profile.birthyear || profile._json?.birthyear;
    const phone = profile.mobile || profile._json?.mobile;

    if (!email) {
      console.error("❌ 이메일이 없습니다.");
      throw new Error("이메일이 없습니다.");
    }

    console.log(`✅ 로그인 성공: ${nickname} (${email})`);

    const user = await this.authService.validateNaverUser({
      email,
      name,
      nickname,
      birthYear,
      phone,
    });

    return user;
  }
}
