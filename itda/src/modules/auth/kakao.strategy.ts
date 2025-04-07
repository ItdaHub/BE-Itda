import { Strategy } from "passport-kakao";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, "kakao") {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService
  ) {
    super({
      clientID: configService.get<string>("KAKAO_CLIENT_ID", ""),
      clientSecret: configService.get<string>("KAKAO_CLIENT_SECRET", ""),
      callbackURL: configService.get<string>("KAKAO_CALLBACK_URL", ""),
    });

    console.log("카카오 로그인 설정 완료 ✅");
  }

  // ✅ done 안 쓰고 Promise 패턴으로 리턴
  async validate(accessToken: string, refreshToken: string, profile: any) {
    console.log("📌 카카오 프로필:", profile);

    const kakaoData = profile._json || JSON.parse(profile._raw || "{}");
    console.log("📌 profile._json 전체:", JSON.stringify(kakaoData, null, 2));

    const kakaoAccount = kakaoData.kakao_account;
    if (!kakaoAccount) {
      console.error("❌ 카카오 계정 정보가 없습니다.");
      throw new Error("카카오 계정 정보가 없습니다.");
    }

    const email = kakaoAccount?.email;
    const nickname = kakaoData?.properties?.nickname;

    if (!email || !nickname) {
      console.error("❌ 필수 정보 누락 - 이메일 또는 닉네임");
      throw new Error("이메일 또는 닉네임이 없습니다.");
    }

    console.log(`✅ 로그인 성공: ${nickname} (${email})`);

    const user = await this.authService.validateKakaoUser({ email, nickname });

    return user;
  }
}
