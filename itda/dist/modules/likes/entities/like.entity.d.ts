import { User } from "src/modules/users/entities/user.entity";
import { Novel } from "src/modules/novels/entities/novel.entity";
import { Comment } from "src/modules/comments/entities/comment.entity";
export declare class Like {
    id: number;
    user: User;
    target_type: "novel" | "comment";
    novel: Novel | null;
    comment: Comment | null;
    created_at: Date;
}
