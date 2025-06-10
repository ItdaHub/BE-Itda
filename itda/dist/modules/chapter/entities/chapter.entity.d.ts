import { Novel } from "../../novels/entities/novel.entity";
import { User } from "../../users/entities/user.entity";
import { Comment } from "../../comments/entities/comment.entity";
import { Report } from "src/modules/reports/entities/report.entity";
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
