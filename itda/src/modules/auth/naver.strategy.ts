import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-naver";
import { Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";

// 연령대 추가(네이버만) or birthyear자리에 연령대 저장
// 연령대 받아와서 저장하고 이걸 가지고 연령별
// 구글, 카카오 출생연도 => 연령대로 변환 => 프론트 메인 화면에 뿌려주기

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
    console.log("📌 네이버 프로필:", profile);
    console.log("🔍 네이버 프로필 전체:", profile);
    console.log("🔍 네이버 프로필 _json:", profile._json);
    console.log("✅ 네이버 프로필 전체 profile:", profile);
    console.log(
      "✅ 네이버 프로필 _json:",
      JSON.stringify(profile._json, null, 2)
    );

    const email = profile?.email || profile._json?.email;
    const name = profile?.name || profile.displayName;
    const nickname = profile.nickname || email?.split("@")[0];
    const birthYear = profile._json?.birthyear;
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
