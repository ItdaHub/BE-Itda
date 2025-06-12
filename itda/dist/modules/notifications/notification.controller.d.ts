import { NotificationService } from "./notification.service";
import { Notification } from "./entities/notification.entity";
import { Request } from "express";
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getUserNotifications(req: Request): Promise<Notification[]>;
    markNotificationAsRead(notificationId: number, userId: number, novelId: number): Promise<Notification>;
}
