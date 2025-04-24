import { User } from "../users/user.entity";
export declare class Purchase {
    id: number;
    user: User;
    novelId: number;
    chapterId: number;
    created_at: Date;
}
