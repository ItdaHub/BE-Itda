import { Controller, Get, Param, Patch, Req, UseGuards } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { Notification } from "./notification.entity";
import { JwtAuthGuard } from "../auth/jwtauth.guard";
import { Request } from "express";
import { User } from "../users/user.entity";

@Controller("notifications")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // ✅ 유저의 알림 목록 조회
  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserNotifications(@Req() req: Request) {
    const user = req.user as User;
    return this.notificationService.getUserNotifications(user.id);
  }

  // ✅ 알림 읽음 처리
  @Patch(":notificationId/read")
  async markNotificationAsRead(
    @Param("notificationId") notificationId: number
  ): Promise<Notification> {
    return this.notificationService.markNotificationAsRead(notificationId);
  }
}
