import { Strategy } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService
  ) {
    super({
      clientID: configService.get<string>("GOOGLE_CLIENT_ID", ""),
      clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET", ""),
      callbackURL: configService.get<string>("GOOGLE_CALLBACK_URL", ""),
      scope: ["email", "profile"],
    });

    console.log("구글 로그인 설정 완료 ✅");
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    console.log("📌 구글 프로필:", profile);

    const email =
      Array.isArray(profile.emails) && profile.emails.length > 0
        ? profile.emails[0].value
        : profile._json?.email || null;

    const nickname =
      profile.displayName || profile._json?.name || email?.split("@")[0];

    if (!email) {
      console.error("❌ 이메일을 찾을 수 없습니다.");
      throw new Error("이메일이 없습니다.");
    }

    console.log(`✅ 로그인 성공: ${nickname} (${email})`);

    // ✅ authService에서 로그인 응답 통일 처리
    const user = await this.authService.validateGoogleUser({ email, nickname });

    return user;
  }
}
