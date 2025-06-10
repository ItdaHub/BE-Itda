import { LoginType, UserType, UserStatus } from "../entities/user.entity";
export declare class UpdateUserDto {
    email?: string;
    password?: string;
    profile_img?: string;
    phone?: string;
    type?: LoginType;
    name?: string;
    nickname?: string;
    age?: number;
    user_type?: UserType;
    status?: UserStatus;
}
