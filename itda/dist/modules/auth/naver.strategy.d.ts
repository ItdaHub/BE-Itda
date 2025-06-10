import { Strategy } from "passport-naver";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
declare const NaverStrategy_base: new (...args: [options: import("passport-naver").StrategyOptionWithRequest] | [options: import("passport-naver").StrategyOption]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class NaverStrategy extends NaverStrategy_base {
    private readonly authService;
    constructor(authService: AuthService, configService: ConfigService);
    validate(accessToken: string, refreshToken: string, profile: any): Promise<import("../users/entities/user.entity").User>;
}
export {};
