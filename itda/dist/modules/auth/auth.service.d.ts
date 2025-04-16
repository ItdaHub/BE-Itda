import { EntityManager } from "typeorm";
import { User } from "../users/user.entity";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";
import { MailService } from "../mail/mail.service";
type LoginResponse = {
    accessToken: string;
    user: Record<string, any>;
};
export declare class AuthService {
    private entityManager;
    private jwtService;
    private mailService;
    constructor(entityManager: EntityManager, jwtService: JwtService, mailService: MailService);
    private createToken;
    formatResponse(partialUser: User): Promise<LoginResponse>;
    login(user: User): Promise<LoginResponse>;
    validateAdmin(email: string, password: string): Promise<User>;
    validateKakaoUser({ email, nickname, birthYear, }: {
        email: string;
        nickname: string;
        birthYear?: string;
    }): Promise<User>;
    validateNaverUser({ email, name, nickname, birthYear, phone, age_group, }: {
        email: string;
        name?: string;
        nickname?: string;
        birthYear?: string;
        phone?: string;
        age_group?: number;
    }): Promise<User>;
    validateGoogleUser({ email, nickname, birthYear, }: {
        email: string;
        nickname: string;
        birthYear?: string;
    }): Promise<User>;
    validateUser(email: string, password: string): Promise<User>;
    register(userDto: RegisterDto): Promise<{
        user: User;
    }>;
    checkEmail(email: string): Promise<boolean>;
    checkNickName(nickname: string): Promise<boolean>;
    sendPasswordResetToken(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}
export {};
