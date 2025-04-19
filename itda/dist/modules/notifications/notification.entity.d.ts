import { User } from "../users/user.entity";
import { Novel } from "../novels/novel.entity";
import { Report } from "../reports/report.entity";
export declare class Notification {
    id: number;
    user: User;
    novel: Novel | null;
    report: Report | null;
    content: string;
    is_read: boolean;
    created_at: Date;
    type: "REPORT" | "NOVEL_SUBMIT";
}
