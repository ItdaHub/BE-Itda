import { LoginType } from "../../users/user.entity";
export declare class RegisterDto {
    email: string;
    name?: string;
    nickname: string;
    password?: string;
    birthYear?: string;
    phone?: string;
    type: LoginType;
}
