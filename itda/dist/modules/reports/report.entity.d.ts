import { User } from "../users/user.entity";
import { Notification } from "../notifications/notification.entity";
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
    created_at: Date;
    notifications: Notification[];
}
