import { Strategy } from "passport-kakao";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
declare const KakaoStrategy_base: new (...args: [options: import("passport-kakao").StrategyOptionWithRequest] | [options: import("passport-kakao").StrategyOption]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class KakaoStrategy extends KakaoStrategy_base {
    private readonly authService;
    constructor(authService: AuthService, configService: ConfigService);
    validate(accessToken: string, refreshToken: string, profile: any): Promise<{
        token: string;
        user: {
            id: number;
            email: string;
            name: string | undefined;
            profile_img: string;
            phone: string;
            type: import("../users/user.entity").LoginType;
            nickname: string;
            age: number;
            created_at: Date;
            user_type: import("../users/user.entity").UserType;
        };
    }>;
}
export {};
