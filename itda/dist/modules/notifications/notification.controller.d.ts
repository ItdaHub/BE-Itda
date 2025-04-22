import { NotificationService } from "./notification.service";
import { Notification } from "./notification.entity";
import { Request } from "express";
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getUserNotifications(req: Request): Promise<Notification[]>;
    markNotificationAsRead(notificationId: number, userId: number): Promise<Notification>;
}
