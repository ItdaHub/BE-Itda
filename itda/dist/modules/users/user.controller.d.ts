import { UserService } from "./user.service";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/ceateuser.dto";
import { UpdateUserDto } from "./dto/updateuser.dto";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    create(user: CreateUserDto): Promise<User>;
    update(id: number, user: UpdateUserDto): Promise<User>;
    deleteByEmail(email: string): Promise<void>;
    updateNickname(req: any, nickname: string): Promise<{
        message: string;
        nickname: string;
    }>;
    updatePhone(req: any, phone: string): Promise<{
        message: string;
        phone: string;
    }>;
    uploadProfileImage(req: any, file: Express.Multer.File): Promise<{
        message: string;
        filename?: undefined;
    } | {
        message: string;
        filename: string;
    }>;
    deleteProfileImage(req: any): Promise<{
        message: string;
    }>;
    deleteMyAccount(req: any): Promise<void>;
    deleteUsersByAdmin(userIds: number[]): Promise<{
        message: string;
    }>;
}
