import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { Response } from "express";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getLogin(req: any): Promise<{
        accessToken: string;
        user: Record<string, any>;
    }>;
    register(registerDto: RegisterDto): Promise<{
        user: import("../users/user.entity").User;
    }>;
    checkEmail(email: string): Promise<{
        message: string;
    }>;
    checkNickName(nickName: string): Promise<{
        message: string;
    }>;
    login(req: any): Promise<{
        accessToken: string;
        user: Record<string, any>;
    }>;
    kakaoLogin(res: Response): Promise<void>;
    kakaoAuthRedirect(req: any, res: any): Promise<void>;
    naverLogin(res: Response): Promise<void>;
    naverCallback(req: any, res: any): Promise<void>;
    googleLogin(): Promise<void>;
    googleCallback(req: any, res: any): Promise<void>;
}
