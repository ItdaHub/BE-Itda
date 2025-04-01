import { Novel } from "../novels/novel.entity";
import { User } from "../users/user.entity";
export declare class Vote {
    id: number;
    novel: Novel;
    user: User;
    result: "agree" | "disagree";
    created_at: Date;
}
