import { User } from "../users/user.entity";
import { Novel } from "../novels/novel.entity";
import { Chapter } from "../novels/chapter.entity";
import { Like } from "../likes/like.entity";
export declare class Comment {
    id: number;
    novel: Novel;
    chapter: Chapter | null;
    user: User;
    content: string;
    parent_comment: Comment | null;
    childComments: Comment[];
    likes: Like[];
    created_at: Date;
}
