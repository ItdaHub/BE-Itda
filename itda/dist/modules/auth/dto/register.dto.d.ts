import { LoginType } from "../../users/entities/user.entity";
export declare class RegisterDto {
    email: string;
    name?: string;
    nickname: string;
    password?: string;
    birthYear?: string;
    phone?: string;
    type: LoginType;
    age_group?: number;
}
