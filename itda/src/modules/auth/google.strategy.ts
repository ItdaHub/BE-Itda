import { Strategy } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";
import axios from "axios";

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
      scope: [
        "email",
        "profile",
        "https://www.googleapis.com/auth/user.birthday.read", // 생일 읽기 권한
      ],
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

    // 🎂 생일 정보 가져오기 (People API 사용)
    let birthYear: string | null = null;

    try {
      const peopleResponse = await axios.get(
        "https://people.googleapis.com/v1/people/me",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            personFields: "birthdays",
          },
        }
      );

      const birthdays = peopleResponse.data.birthdays;
      const birthDate = birthdays?.[0]?.date;
      if (birthDate?.year) {
        birthYear = String(birthDate.year);
        console.log("🎂 출생년도:", birthYear);
      } else {
        console.log("🎂 생일 정보 없음 (year 없음)");
      }
    } catch (err) {
      console.error("❌ 생일 정보 가져오기 실패:", err.response?.data || err);
    }

    // ✅ authService로 이메일, 닉네임, 생일 전달
    const user = await this.authService.validateGoogleUser({
      email,
      nickname,
      birthYear: birthYear ?? undefined,
    });

    return user;
  }
}
