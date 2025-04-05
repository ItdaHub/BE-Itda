import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { EmailCheckDto } from "./dto/emailchech.dto";
import { Response } from "express";
import { UserService } from "../users/user.service";
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    constructor(authService: AuthService, userService: UserService);
    getProfile(req: any): {
        user: any;
    };
    register(registerDto: RegisterDto): Promise<{
        user: import("../users/user.entity").User;
    }>;
    checkEmail(emailCheckDto: EmailCheckDto): Promise<{
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
    kakaoCallback(req: any, res: Response): Promise<void>;
    naverLogin(res: Response): Promise<void>;
    naverCallback(req: any, res: any): Promise<void>;
    googleLogin(): Promise<void>;
    googleCallback(req: any, res: any): Promise<void>;
    findIdByPhone(phone: string): Promise<{
        id: string;
    }>;
    findPassword(body: {
        email: string;
    }): Promise<{
        message: string;
        data: null;
    } | {
        message: string;
        data: string;
    }>;
    updatePassword(body: {
        email: string;
        password: string;
    }): Promise<{
        message: string;
    }>;
}
