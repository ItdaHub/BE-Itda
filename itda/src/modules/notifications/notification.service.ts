import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notification } from "./entities/notification.entity";
import { User } from "../users/entities/user.entity";
import { Novel } from "../novels/entities/novel.entity";
import { Report } from "../reports/entities/report.entity";
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

  async markNotificationAsRead(
    notificationId: number,
    userId: number
  ): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: {
        id: notificationId,
        user: { id: userId },
      },
      relations: ["user"],
    });

    if (!notification) {
      console.log(`❌ 알림 ${notificationId} (user: ${userId}) 찾을 수 없음`);
      throw new Error("해당 유저의 알림을 찾을 수 없습니다.");
    }

    // 읽음 상태 변경
    notification.is_read = true;
    const saved = await this.notificationRepository.save(notification);

    console.log(`✅ 알림 ${notificationId} 읽음 처리 완료 (user: ${userId})`);

    return saved;
  }
}
