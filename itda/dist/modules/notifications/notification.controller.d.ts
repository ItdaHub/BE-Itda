import { NotificationService } from "./notification.service";
import { Notification } from "./notification.entity";
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    createNotification(userId: number, type: "vote" | "report", novelId: number | null, reportId: number | null, content: string): Promise<Notification>;
    getNotificationsByUser(userId: number): Promise<Notification[]>;
    markNotificationAsRead(notificationId: number): Promise<Notification>;
}
