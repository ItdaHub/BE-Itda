import { UserService } from "./user.service";
import { User } from "./user.entity";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    create(user: User): Promise<User>;
    update(id: number, user: Partial<User>): Promise<User>;
    deleteByEmail(email: string): Promise<void>;
    updateNickname(req: any, nickname: string): Promise<{
        message: string;
        nickname: string;
    }>;
    uploadProfileImage(req: any, file: Express.Multer.File): Promise<{
        message: string;
        filename?: undefined;
    } | {
        message: string;
        filename: string;
    }>;
    deleteMyAccount(req: any): Promise<void>;
    deleteUsersByAdmin(userIds: number[]): Promise<{
        message: string;
    }>;
}
