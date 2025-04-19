import { Controller, Post, Body, Get, Param, Patch } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { Notification } from "./notification.entity";

@Controller("notifications")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // 알림 읽음 처리
  @Patch(":notificationId/read")
  async markNotificationAsRead(
    @Param("notificationId") notificationId: number
  ): Promise<Notification> {
    return this.notificationService.markNotificationAsRead(notificationId);
  }
}
