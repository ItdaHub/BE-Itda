import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notification } from "./notification.entity";
import { User } from "../users/user.entity";
import { Novel } from "../novels/novel.entity";
import { Report } from "../reports/report.entity";

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Novel)
    private novelRepository: Repository<Novel>,
    @InjectRepository(Report)
    private reportRepository: Repository<Report>
  ) {}

  // 알림 생성
  async createNotification(
    userId: number,
    novelId: number | null,
    reportId: number | null,
    content: string
  ): Promise<Notification> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    const novel = novelId
      ? await this.novelRepository.findOne({ where: { id: novelId } })
      : null;

    const report = reportId
      ? await this.reportRepository.findOne({ where: { id: reportId } })
      : null;

    const notification = this.notificationRepository.create({
      user,
      novel,
      report,
      content,
      is_read: false,
    });

    return this.notificationRepository.save(notification);
  }

  // 알림 목록 조회 (사용자별)
  async getNotificationsByUser(userId: number): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { user: { id: userId } },
      relations: ["novel", "report"],
      order: { created_at: "DESC" },
    });
  }

  // 알림 읽음 처리
  async markNotificationAsRead(notificationId: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
    });
    if (!notification) {
      throw new Error("Notification not found");
    }

    notification.is_read = true;
    return this.notificationRepository.save(notification);
  }
}
