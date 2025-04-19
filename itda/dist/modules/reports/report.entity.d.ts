import { User } from "../users/user.entity";
import { Notification } from "../notifications/notification.entity";
import { Chapter } from "../chapter/chapter.entity";
export declare enum TargetType {
    CHAPTER = "chapter",
    COMMENT = "comment"
}
export declare class Report {
    id: number;
    reporter: User;
    target_type: TargetType;
    target_id: number;
    reason: string;
    reported_content: string;
    chapter: Chapter;
    reported_user_id?: number;
    created_at: Date;
    notifications: Notification[];
}
