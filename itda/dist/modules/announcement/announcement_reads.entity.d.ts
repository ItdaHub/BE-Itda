import { User } from "../users/user.entity";
import { Announcement } from "../announcement/announcement.entity";
export declare class AnnouncementRead {
    id: number;
    user: User;
    announcement: Announcement;
    readAt: Date;
}
