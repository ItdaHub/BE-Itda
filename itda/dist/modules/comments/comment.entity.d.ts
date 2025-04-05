import { User } from "../users/user.entity";
import { Novel } from "../novels/novel.entity";
import { Chapter } from "../chapter/chapter.entity";
import { Like } from "../likes/like.entity";
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
