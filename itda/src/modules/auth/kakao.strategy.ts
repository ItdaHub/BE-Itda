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

  async validate(accessToken: string, refreshToken: string, profile: any) {
    console.log("📌 카카오 프로필:", profile);

    // profile._json이 없으면 profile._raw에서 파싱
    const kakaoData = profile._json || JSON.parse(profile._raw || "{}");

    console.log("📌 profile._json 전체:", JSON.stringify(kakaoData, null, 2));

    // kakao_account 존재 여부 확인
    const kakaoAccount = kakaoData.kakao_account;
    console.log("🟢 kakaoAccount:", JSON.stringify(kakaoAccount, null, 2));

    if (!kakaoAccount) {
      console.error("❌ 카카오 계정 정보가 없습니다.");
      throw new Error("카카오 계정 정보가 없습니다.");
    }

    // 이메일과 닉네임 추출
    const email = kakaoAccount?.email;
    const nickname = kakaoData?.properties?.nickname;

    if (!email) {
      console.error("❌ 이메일을 찾을 수 없습니다.");
      throw new Error("이메일이 없습니다.");
    }

    if (!nickname) {
      console.error("❌ 닉네임을 찾을 수 없습니다.");
      throw new Error("닉네임이 없습니다.");
    }

    console.log(`✅ 로그인 성공: ${nickname} (${email})`);

    // AuthService에 email, nickname만 전달
    return this.authService.validateKakaoUser({ email, nickname });
  }
}
