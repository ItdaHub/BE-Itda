import { User } from "../../users/entities/user.entity";
import { Novel } from "../../novels/entities/novel.entity";
import { Report } from "src/modules/reports/entities/report.entity";
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
