import { EntityManager } from "typeorm";
import { User } from "../users/user.entity";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";
type LoginResponse = {
    accessToken: string;
    user: Record<string, any>;
};
export declare class AuthService {
    private entityManager;
    private jwtService;
    constructor(entityManager: EntityManager, jwtService: JwtService);
    private createToken;
    formatResponse(user: User): LoginResponse;
    login(user: User): Promise<LoginResponse>;
    validateKakaoUser({ email, nickname, }: {
        email: string;
        nickname: string;
    }): Promise<User>;
    validateNaverUser({ email, name, nickname, birthYear, phone, }: {
        email: string;
        name?: string;
        nickname?: string;
        birthYear?: string;
        phone?: string;
    }): Promise<User>;
    validateGoogleUser({ email, nickname, }: {
        email: string;
        nickname: string;
    }): Promise<User>;
    validateUser(email: string, password: string): Promise<LoginResponse>;
    register(userDto: RegisterDto): Promise<{
        user: User;
    }>;
    checkEmail(email: string): Promise<boolean>;
    checkNickName(nickname: string): Promise<boolean>;
}
export {};
