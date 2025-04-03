import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginType } from "../users/user.entity";
import { Response } from "express";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getLogin(req: any): Promise<{
        token: string;
        user: {
            id: number;
            email: string;
            name: string | undefined;
            profile_img: string;
            phone: string;
            type: LoginType;
            nickname: string;
            age: number;
            created_at: Date;
            user_type: import("../users/user.entity").UserType;
        };
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
        token: string;
        user: import("../users/user.entity").User;
    }>;
    kakaoLogin(): Promise<void>;
    kakaoCallback(req: any): Promise<{
        token: string;
        user: import("../users/user.entity").User;
    }>;
    naverLogin(res: Response): Promise<void>;
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
