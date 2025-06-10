import { User } from "src/modules/users/entities/user.entity";
import { Notification } from "src/modules/notifications/entities/notification.entity";
import { Chapter } from "src/modules/chapter/entities/chapter.entity";
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
    handled: boolean;
}
