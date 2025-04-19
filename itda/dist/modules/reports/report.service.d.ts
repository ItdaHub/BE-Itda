import { Repository } from "typeorm";
import { Report } from "./report.entity";
import { Comment } from "../comments/comment.entity";
import { Chapter } from "../chapter/chapter.entity";
import { User } from "../users/user.entity";
import { UserService } from "../users/user.service";
import { NotificationService } from "../notifications/notification.service";
export declare class ReportService {
    private readonly reportRepository;
    private readonly commentRepository;
    private readonly chapterRepository;
    private readonly userService;
    private readonly notificationService;
    constructor(reportRepository: Repository<Report>, commentRepository: Repository<Comment>, chapterRepository: Repository<Chapter>, userService: UserService, notificationService: NotificationService);
    findAll(): Promise<Report[]>;
    findOne(id: number): Promise<Report>;
    create(report: Report): Promise<Report>;
    delete(id: number): Promise<boolean>;
    findReportedUser(report: Report): Promise<User | null>;
    findReportedUserByComment(commentId: number): Promise<User | null>;
    handleReport(reportId: number): Promise<boolean>;
}
