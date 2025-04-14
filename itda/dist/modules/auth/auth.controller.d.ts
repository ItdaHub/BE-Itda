import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { EmailCheckDto } from "./dto/emailchech.dto";
import { Response } from "express";
import { UserService } from "../users/user.service";
import { MailService } from "../mail/mail.service";
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    private readonly mailService;
    constructor(authService: AuthService, userService: UserService, mailService: MailService);
    getProfile(req: any): Promise<{
        user: import("../users/user.entity").User | null;
    }>;
    register(registerDto: RegisterDto): Promise<{
        user: import("../users/user.entity").User;
    }>;
    checkEmail(emailCheckDto: EmailCheckDto): Promise<{
        success: boolean;
        message: string;
    }>;
    checkNickname(nickName: string): Promise<{
        success: boolean;
        message: string;
    }>;
    checkNicknameForEdit(req: any, nickName: string): Promise<{
        message: string;
        available: boolean;
    }>;
    login(req: any, res: Response): Promise<void>;
    logout(res: Response): Response<any, Record<string, any>>;
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
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(body: {
        token: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    updatePasswordPage(token: string): Promise<{
        message: string;
        userId: number;
    }>;
}
