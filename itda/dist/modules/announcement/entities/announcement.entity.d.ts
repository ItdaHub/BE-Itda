import { User } from "src/modules/users/entities/user.entity";
import { AnnouncementRead } from "src/modules/announcement/entities/announcementread.entity";
export declare class Announcement {
    id: number;
    title: string;
    content: string;
    admin: User;
    priority: "urgent" | "normal";
    start_date: Date;
    created_at: Date;
    updated_at: Date;
    reads: AnnouncementRead[];
}
