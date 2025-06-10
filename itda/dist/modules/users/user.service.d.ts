import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { Point } from "../points/entities/point.entity";
import { CreateUserDto } from "./dto/ceateuser.dto";
export declare class UserService {
    private userRepository;
    private pointRepository;
    private readonly logger;
    constructor(userRepository: Repository<User>, pointRepository: Repository<Point>);
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    create(userDto: CreateUserDto): Promise<User>;
    update(id: number, userData: Partial<User>): Promise<User>;
    deleteProfileImage(userId: number): Promise<void>;
    remove(userId: number, requestUser: User): Promise<void>;
    findByPhone(phone: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<User>;
    findById(id: number): Promise<User | null>;
    removeByEmail(email: string): Promise<void>;
    updateProfileImage(userId: number, filename: string): Promise<void>;
    removeMultiple(ids: number[]): Promise<void>;
    deleteUsersByAdmin(userIds: number[]): Promise<void>;
    private deleteUserAndRelatedData;
}
