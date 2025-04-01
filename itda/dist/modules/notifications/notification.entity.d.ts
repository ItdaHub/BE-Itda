import { User } from "../users/user.entity";
import { Novel } from "../novels/novel.entity";
import { Report } from "../reports/report.entity";
export declare enum NotificationType {
    VOTE = "vote",
    REPORT = "report"
}
export declare class Notification {
    id: number;
    user: User;
    type: NotificationType;
    novel: Novel | null;
    report: Report | null;
    content: string;
    is_read: boolean;
    created_at: Date;
}
