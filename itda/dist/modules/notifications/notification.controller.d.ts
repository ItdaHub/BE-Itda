import { NotificationService } from "./notification.service";
import { Notification } from "./notification.entity";
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    markNotificationAsRead(notificationId: number): Promise<Notification>;
}
