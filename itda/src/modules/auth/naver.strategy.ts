import { Strategy } from "passport-naver";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";

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
      scope: ["email", "name", "nickname", "age", "birthday", "mobile"],
    } as any);

    console.log("네이버 로그인 설정 완료 ✅");
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    console.log("📌 네이버 프로필 전체:", profile._json);

    const { email, name, nickname, id } = profile._json;

    if (!email) {
      throw new Error("이메일이 없습니다.");
    }

    const userName = name || nickname || "네이버 유저";

    return {
      email,
      name: userName,
      nickname,
      provider: "naver",
      providerId: id,
    };
  }
}
