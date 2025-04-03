import { EntityManager } from "typeorm";
import { User } from "../users/user.entity";
import { JwtService } from "@nestjs/jwt";
import { LoginType } from "../users/user.entity";
import { CreateUserDto } from "../users/dto/ceateuser.dto";
export declare class AuthService {
    private entityManager;
    private jwtService;
    constructor(entityManager: EntityManager, jwtService: JwtService);
    private createToken;
    formatResponse(user: User): {
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
    };
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
    validateNaverUser({ email, name, nickname, birthYear, phone, }: {
        email: string;
        name?: string;
        nickname?: string;
        birthYear?: string;
        phone?: string;
    }): Promise<{
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
    validateGoogleUser(profile: any): Promise<{
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
    validateUser(email: string, password: string): Promise<{
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
    register(userDto: CreateUserDto): Promise<{
        user: User;
    }>;
}
