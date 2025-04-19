import { Novel } from "../novels/novel.entity";
import { User } from "../users/user.entity";
import { Comment } from "../comments/comment.entity";
import { Report } from "../reports/report.entity";
export declare class Chapter {
    id: number;
    novel: Novel;
    author: User;
    content: string;
    chapter_number: number;
    created_at: Date;
    comments: Comment[];
    reports: Report[];
    isPaid: boolean;
}
