import { AnnouncementService } from "./announcement.service";
import { Request } from "express";
export declare class AnnouncementController {
    private readonly announcementService;
    constructor(announcementService: AnnouncementService);
    createAnnouncement(req: Request, body: any): Promise<import("./dto/announcement.dto").AnnouncementWithAdminDto>;
    deleteAnnouncement(id: string): Promise<{
        message: string;
    }>;
    getAllAnnouncements(): Promise<import("./dto/announcement.dto").AnnouncementWithAdminDto[]>;
    getAnnouncement(id: string): Promise<import("./dto/announcement.dto").AnnouncementWithAdminDto>;
    updateAnnouncement(id: string, body: {
        title: string;
        content: string;
        priority?: "urgent" | "normal";
    }): Promise<import("./dto/announcement.dto").AnnouncementWithAdminDto>;
    markAsRead(id: number, req: any): Promise<{
        message: string;
    }>;
}
