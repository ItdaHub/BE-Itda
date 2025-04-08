import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-naver";
import { Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { convertNaverAgeToGroup } from "./utils/agegroup.util";

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
      scope: ["name", "email", "nickname", "mobile", "birthyear"],
    } as any);

    console.log("네이버 로그인 설정 완료 ✅");
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const email = profile?.email || profile._json?.email;
    const name = profile?.name || profile.displayName;
    const nickname = profile.nickname || email?.split("@")[0];
    const phone = profile.mobile || profile._json?.mobile;

    // ✅ 네이버는 birthyear 대신 age 사용!
    const ageStr = profile._json?.age;
    const age_group = convertNaverAgeToGroup(ageStr) ?? undefined;
    console.log("✅ 변환된 age_group:", age_group);

    const birthYear = profile._json?.birthyear;

    if (!email) {
      console.error("❌ 이메일이 없습니다.");
      throw new Error("이메일이 없습니다.");
    }

    const user = await this.authService.validateNaverUser({
      email,
      name,
      nickname,
      phone,
      age_group,
      birthYear,
    });

    return user;
  }
}
