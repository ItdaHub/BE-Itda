import { Novel } from "./novel.entity";
import { User } from "../users/user.entity";
import { Comment } from "../interactions/comment.entity";
export declare class Chapter {
    id: number;
    novel: Novel;
    author: User;
    content: string;
    chapter_number: number;
    created_at: Date;
    comments: Comment[];
}
