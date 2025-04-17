import { Repository } from "typeorm";
import { Notification } from "./notification.entity";
import { User } from "../users/user.entity";
import { Novel } from "../novels/novel.entity";
import { Report } from "../reports/report.entity";
export declare class NotificationService {
    private notificationRepository;
    private userRepository;
    private novelRepository;
    private reportRepository;
    constructor(notificationRepository: Repository<Notification>, userRepository: Repository<User>, novelRepository: Repository<Novel>, reportRepository: Repository<Report>);
    createNotification(userId: number, novelId: number | null, reportId: number | null, content: string): Promise<Notification>;
    getNotificationsByUser(userId: number): Promise<Notification[]>;
    markNotificationAsRead(notificationId: number): Promise<Notification>;
}
