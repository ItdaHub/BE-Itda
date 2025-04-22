import { Repository } from "typeorm";
import { Announcement } from "./announcement.entity";
import { User } from "../users/user.entity";
import { AnnouncementWithAdminDto } from "./dto/announcement.dto";
import { AnnouncementRead } from "./announcementread.entity";
export declare class AnnouncementService {
    private readonly announcementRepo;
    private readonly readRepo;
    private readonly userRepo;
    constructor(announcementRepo: Repository<Announcement>, readRepo: Repository<AnnouncementRead>, userRepo: Repository<User>);
    createAnnouncement(title: string, content: string, admin: User, priority?: "urgent" | "normal"): Promise<AnnouncementWithAdminDto>;
    deleteAnnouncement(id: number): Promise<{
        message: string;
    }>;
    getAllAnnouncements(): Promise<AnnouncementWithAdminDto[]>;
    getAnnouncementById(id: number): Promise<AnnouncementWithAdminDto>;
    updateAnnouncement(id: number, title: string, content: string, priority?: "urgent" | "normal"): Promise<AnnouncementWithAdminDto>;
    private toDto;
    markAsRead(announcementId: number, userId: number): Promise<{
        message: string;
    }>;
    getUnreadAnnouncements(userId: number): Promise<AnnouncementWithAdminDto[]>;
}
