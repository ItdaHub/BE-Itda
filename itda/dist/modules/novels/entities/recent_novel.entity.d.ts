import { User } from "src/modules/users/entities/user.entity";
import { Novel } from "./novel.entity";
export declare class RecentNovel {
    id: number;
    user: User;
    novel: Novel;
    viewedAt: Date;
}
