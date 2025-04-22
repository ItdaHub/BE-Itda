import { Repository } from "typeorm";
import { Notification } from "./notification.entity";
import { User } from "../users/user.entity";
import { Novel } from "../novels/novel.entity";
import { Report } from "../reports/report.entity";
import { SendNotificationDto } from "./dto/notification.dto";
export declare class NotificationService {
    private notificationRepository;
    private userRepository;
    private novelRepository;
    private reportRepository;
    constructor(notificationRepository: Repository<Notification>, userRepository: Repository<User>, novelRepository: Repository<Novel>, reportRepository: Repository<Report>);
    getUserNotifications(userId: number): Promise<Notification[]>;
    sendNotification({ user, content, novel, report, type, }: SendNotificationDto): Promise<Notification>;
    markNotificationAsRead(notificationId: number, userId: number): Promise<Notification>;
}
