import { Repository } from "typeorm";
import { Announcement } from "./announcement.entity";
import { User } from "../users/user.entity";
export declare class AnnouncementService {
    private readonly announcementRepo;
    constructor(announcementRepo: Repository<Announcement>);
    createAnnouncement(title: string, content: string, admin: User): Promise<Announcement>;
    deleteAnnouncement(id: number): Promise<{
        message: string;
    }>;
    getAllAnnouncements(): Promise<Announcement[]>;
    updateAnnouncement(id: number, title: string, content: string): Promise<Announcement>;
    getAnnouncementById(id: number): Promise<Announcement>;
}
