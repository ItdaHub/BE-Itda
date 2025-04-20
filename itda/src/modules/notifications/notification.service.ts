import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notification } from "./notification.entity";
import { User } from "../users/user.entity";
import { Novel } from "../novels/novel.entity";
import { Report } from "../reports/report.entity";
import { SendNotificationDto } from "./dto/notification.dto";

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

  async getUserNotifications(userId: number): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { user: { id: userId } },
      order: { created_at: "DESC" },
    });
  }

  async sendNotification({
    user,
    content,
    novel = null,
    report = null,
    type = "REPORT", // 기본값 설정
  }: SendNotificationDto) {
    const notification = this.notificationRepository.create({
      user,
      content,
      novel,
      report,
      type,
    });

    return await this.notificationRepository.save(notification);
  }

  // 알림 읽음 처리
  async markNotificationAsRead(notificationId: number): Promise<Notification> {
    // 알림 찾기
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new Error("알림을 찾을 수 없습니다."); // 알림이 없을 경우 예외 처리
    }

    // 읽음 상태로 변경
    notification.is_read = true;

    // 변경된 알림 저장
    return await this.notificationRepository.save(notification);
  }
}
