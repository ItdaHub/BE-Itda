import { User } from "../../users/entities/user.entity";
import { Novel } from "../../novels/entities/novel.entity";
import { Chapter } from "../../chapter/entities/chapter.entity";
import { Like } from "src/modules/likes/entities/like.entity";
export declare class Comment {
    id: number;
    content: string;
    user: User;
    novel: Novel | null;
    chapter: Chapter | null;
    parent_comment: Comment | null;
    childComments: Comment[];
    likes: Like[];
    created_at: Date;
}
