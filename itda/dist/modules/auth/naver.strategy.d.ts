import { Strategy } from "passport-naver";
import { AuthService } from "./auth.service";
declare const NaverStrategy_base: new (...args: [options: import("passport-naver").StrategyOptionWithRequest] | [options: import("passport-naver").StrategyOption]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class NaverStrategy extends NaverStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: any): Promise<import("../users/user.entity").User>;
}
export {};
