import { User } from "../../users/entities/user.entity";
import { Announcement } from "./announcement.entity";
export declare class AnnouncementRead {
    id: number;
    user: User;
    announcement: Announcement;
    isRead: boolean;
    readAt: Date;
}
