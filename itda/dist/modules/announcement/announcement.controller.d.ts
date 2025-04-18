import { AnnouncementService } from "./announcement.service";
import { Request } from "express";
import { Announcement } from "./announcement.entity";
export declare class AnnouncementController {
    private readonly announcementService;
    constructor(announcementService: AnnouncementService);
    createAnnouncement(req: Request, body: any): Promise<Announcement>;
    deleteAnnouncement(id: string): Promise<{
        message: string;
    }>;
    getAllAnnouncements(): Promise<Announcement[]>;
    getAnnouncement(id: string): Promise<Announcement>;
    updateAnnouncement(id: string, body: {
        title: string;
        content: string;
    }): Promise<Announcement>;
}
