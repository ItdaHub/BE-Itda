import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<import("../users/user.entity").User>;
    login(req: any): Promise<{
        access_token: string;
    }>;
    kakaoLogin(req: any): Promise<{
        access_token: string;
    }>;
    naverLogin(req: any): Promise<void>;
    googleLogin(req: any): Promise<{
        access_token: string;
    }>;
}
