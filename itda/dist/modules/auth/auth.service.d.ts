import { EntityManager } from "typeorm";
import { User } from "../users/user.entity";
import { JwtService } from "@nestjs/jwt";
import { LoginType } from "../users/user.entity";
import { RegisterDto } from "./dto/register.dto";
export declare class AuthService {
    private entityManager;
    private jwtService;
    constructor(entityManager: EntityManager, jwtService: JwtService);
    private createToken;
    private formatResponse;
    login(user: User): Promise<{
        token: string;
        user: User;
    }>;
    validateKakaoUser({ email, nickname, }: {
        email: string;
        nickname: string;
    }): Promise<{
        token: string;
        user: {
            id: number;
            email: string;
            profile_img: string;
            phone: string;
            type: LoginType;
            nickname: string;
            age: number;
            created_at: Date;
            user_type: import("../users/user.entity").UserType;
        };
    }>;
    validateUser(email: string, password: string): Promise<{
        token: string;
        user: {
            id: number;
            email: string;
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
        token: string;
        user: any;
    }>;
}
