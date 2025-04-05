import { User } from "../users/user.entity";
import { Novel } from "../novels/novel.entity";
import { Comment } from "../comments/comment.entity";
export declare class Like {
    id: number;
    user: User;
    target_type: "novel" | "comment";
    novel: Novel | null;
    comment: Comment | null;
    created_at: Date;
}
