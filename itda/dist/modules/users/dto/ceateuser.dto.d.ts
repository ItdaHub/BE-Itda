import { LoginType, UserStatus, UserType } from "../entities/user.entity";
export declare class CreateUserDto {
    email: string;
    name?: string;
    nickname: string;
    password?: string;
    type: LoginType;
    profile_img?: string;
    phone?: string;
    age?: number;
    user_type?: UserType;
    status?: UserStatus;
    birthYear?: string;
}
