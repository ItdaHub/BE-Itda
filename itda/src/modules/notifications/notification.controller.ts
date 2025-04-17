import { Controller, Post, Body, Get, Param, Patch } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { Notification } from "./notification.entity";

@Controller("notifications")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // 알림 생성
  @Post()
  async createNotification(
    @Body("userId") userId: number,
    @Body("novelId") novelId: number | null,
    @Body("reportId") reportId: number | null,
    @Body("content") content: string
  ): Promise<Notification> {
    return this.notificationService.createNotification(
      userId,
      novelId,
      reportId,
      content
    );
  }

  // 사용자별 알림 목록 조회
  @Get(":userId")
  async getNotificationsByUser(
    @Param("userId") userId: number
  ): Promise<Notification[]> {
    return this.notificationService.getNotificationsByUser(userId);
  }

  // 알림 읽음 처리
  @Patch(":notificationId/read")
  async markNotificationAsRead(
    @Param("notificationId") notificationId: number
  ): Promise<Notification> {
    return this.notificationService.markNotificationAsRead(notificationId);
  }
}
