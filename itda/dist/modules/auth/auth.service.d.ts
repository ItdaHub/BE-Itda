import { EntityManager } from "typeorm";
import { User } from "../users/user.entity";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";
export declare class AuthService {
    private entityManager;
    private jwtService;
    constructor(entityManager: EntityManager, jwtService: JwtService);
    validateKakaoUser(profile: any): Promise<User>;
    validateNaverUser(profile: any): Promise<User>;
    validateGoogleUser(profile: any): Promise<User>;
    private calculateAge;
    register(registerDto: RegisterDto): Promise<User>;
    validateUser(email: string, password: string): Promise<User>;
    login(user: User): Promise<{
        access_token: string;
    }>;
}
