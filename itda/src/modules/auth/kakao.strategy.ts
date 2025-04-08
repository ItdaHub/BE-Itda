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

    console.log("Kakao client ID:", process.env.KAKAO_CLIENT_ID);
    console.log("Kakao KAKAO_CLIENT_SECRET:", process.env.KAKAO_CLIENT_SECRET);
    console.log("Kakao redirect URI:", process.env.KAKAO_CALLBACK_URL);

    console.log("카카오 로그인 설정 완료 ✅");
  }

  // ✅ done 안 쓰고 Promise 패턴으로 리턴
  async validate(accessToken: string, refreshToken: string, profile: any) {
    console.log("📌 카카오 프로필:", profile);

    const kakaoData = profile._json || JSON.parse(profile._raw || "{}");
    const kakaoAccount = kakaoData.kakao_account;

    const email = kakaoAccount?.email;
    const nickname = kakaoData?.properties?.nickname;
    const birthYear = kakaoAccount?.birthyear || null;

    console.log("🎂 출생년도:", birthYear);

    if (!email || !nickname) {
      throw new Error("이메일 또는 닉네임이 없습니다.");
    }

    const user = await this.authService.validateKakaoUser({
      email,
      nickname,
      birthYear: birthYear ?? undefined,
    });

    return user;
  }
}
