import { LoginType } from "../../users/user.entity";
export declare class RegisterDto {
    email: string;
    password: string | null;
    nickname: string;
    birthDate?: string;
    type: LoginType;
}
