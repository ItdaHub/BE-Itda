import { Strategy } from "passport-naver";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
declare const NaverStrategy_base: new (...args: [options: import("passport-naver").StrategyOptionWithRequest] | [options: import("passport-naver").StrategyOption]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class NaverStrategy extends NaverStrategy_base {
    private readonly authService;
    constructor(authService: AuthService, configService: ConfigService);
    validate(accessToken: string, refreshToken: string, profile: any): Promise<{
        email: any;
        name: any;
        nickname: any;
        provider: string;
        providerId: any;
    }>;
}
export {};
