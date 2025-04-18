import { AnnouncementService } from "./announcement.service";
import { Request } from "express";
export declare class AnnouncementController {
    private readonly announcementService;
    constructor(announcementService: AnnouncementService);
    createAnnouncement(req: Request, body: any): Promise<import("./announcement.entity").Announcement>;
}
