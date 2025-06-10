import { Strategy } from "passport-kakao";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
declare const KakaoStrategy_base: new (...args: [options: import("passport-kakao").StrategyOptionWithRequest] | [options: import("passport-kakao").StrategyOption]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class KakaoStrategy extends KakaoStrategy_base {
    private readonly authService;
    constructor(authService: AuthService, configService: ConfigService);
    validate(accessToken: string, refreshToken: string, profile: any): Promise<import("../users/entities/user.entity").User>;
}
export {};
