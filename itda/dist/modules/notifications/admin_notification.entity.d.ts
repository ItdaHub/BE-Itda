import { User } from "../users/user.entity";
export declare class AdminNotification {
    id: number;
    admin: User;
    user: User;
    content: string;
    type: "announcement" | "report";
    priority: "urgent" | "important" | "normal";
    is_read: boolean;
    created_at: Date;
}
