import { User } from "../users/user.entity";
import { AnnouncementRead } from "./announcementread.entity";
export declare class Announcement {
    id: number;
    title: string;
    content: string;
    admin: User;
    priority: "urgent" | "normal";
    start_date: Date;
    created_at: Date;
    updated_at: Date;
    isRead: boolean;
    reads: AnnouncementRead[];
}
