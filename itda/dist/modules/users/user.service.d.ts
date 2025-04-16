import { Repository } from "typeorm";
import { User } from "./user.entity";
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    create(user: User): Promise<User>;
    update(id: number, user: Partial<User>): Promise<User>;
    remove(id: number): Promise<void>;
    findByPhone(phone: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<User>;
    findById(id: number): Promise<User | null>;
    removeByEmail(email: string): Promise<void>;
    updateProfileImage(userId: number, filename: string): Promise<void>;
}
