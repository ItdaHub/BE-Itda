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
    formatResponse(partialUser: User): Promise<LoginResponse>;
    login(user: User): Promise<LoginResponse>;
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
}
export {};
