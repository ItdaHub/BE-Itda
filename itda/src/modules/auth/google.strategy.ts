import { Strategy } from "passport-google-oauth20";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(private authService: AuthService) {
    super({
      clientID: "구글 앱 클라이언트 아이디",
      clientSecret: "구글 앱 클라이언트 시크릿",
      callbackURL: "구글 인증 콜백 URL",
      scope: ["email", "profile"],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const user = await this.authService.validateGoogleUser(profile);
    return user;
  }
}
// login get
