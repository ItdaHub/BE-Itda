import { Repository } from "typeorm";
import { Announcement } from "./entities/announcement.entity";
import { User } from "../users/entities/user.entity";
import { AnnouncementWithAdminDto } from "./dto/announcement.dto";
import { AnnouncementRead } from "./entities/announcementread.entity";
export declare class AnnouncementService {
    private readonly announcementRepository;
    private readonly readRepository;
    private readonly userRepository;
    constructor(announcementRepository: Repository<Announcement>, readRepository: Repository<AnnouncementRead>, userRepository: Repository<User>);
    createAnnouncement(title: string, content: string, admin: User, priority?: "urgent" | "normal"): Promise<AnnouncementWithAdminDto>;
    deleteAnnouncement(id: number): Promise<{
        message: string;
    }>;
    getAllAnnouncements(userId?: number): Promise<AnnouncementWithAdminDto[]>;
    getAnnouncementById(id: number): Promise<AnnouncementWithAdminDto>;
    updateAnnouncement(id: number, title: string, content: string, priority?: "urgent" | "normal"): Promise<AnnouncementWithAdminDto>;
    markAsRead(announcementId: number, userId: number): Promise<{
        message: string;
    }>;
    private toDto;
}
