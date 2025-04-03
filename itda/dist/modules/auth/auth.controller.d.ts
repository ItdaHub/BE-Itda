import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        token: string;
        user: any;
    }>;
    login(req: any): Promise<{
        token: string;
        user: import("../users/user.entity").User;
    }>;
    kakaoLogin(): Promise<void>;
    kakaoCallback(req: any): Promise<{
        token: string;
        user: import("../users/user.entity").User;
    }>;
    naverLogin(): Promise<void>;
    naverCallback(req: any): Promise<{
        token: string;
        user: import("../users/user.entity").User;
    }>;
    googleLogin(): Promise<void>;
    googleCallback(req: any): Promise<{
        token: string;
        user: import("../users/user.entity").User;
    }>;
}
