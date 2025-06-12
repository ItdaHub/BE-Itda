import {
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
  Body,
  ParseIntPipe,
} from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { Notification } from "./entities/notification.entity";
import { JwtAuthGuard } from "../auth/jwtauth.guard";
import { Request } from "express";
import { User } from "../users/entities/user.entity";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";

@ApiTags("알림(Notification)")
@Controller("notifications")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // ✅ 유저의 알림 목록 조회
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "유저 알림 목록 조회",
    description: "로그인한 유저의 알림 리스트를 조회합니다.",
  })
  @ApiResponse({ status: 200, description: "알림 목록 반환" })
  async getUserNotifications(@Req() req: Request) {
    const user = req.user as User;
    return this.notificationService.getUserNotifications(user.id);
  }

  // ✅ 알림 읽음 처리
  @Patch(":notificationId/read")
  @ApiOperation({
    summary: "알림 읽음 처리",
    description: "특정 알림을 읽음 상태로 변경합니다.",
  })
  @ApiParam({
    name: "notificationId",
    type: Number,
    description: "읽음 처리할 알림 ID",
  })
  @ApiBody({
    schema: {
      type: "object",
      required: ["userId", "novelId"],
      properties: {
        userId: { type: "number", example: 1 },
        novelId: { type: "number", example: 42 },
      },
    },
  })
  @ApiResponse({ status: 200, description: "읽음 처리된 알림 반환" })
  async markNotificationAsRead(
    @Param("notificationId", ParseIntPipe) notificationId: number,
    @Body("userId") userId: number,
    @Body("novelId") novelId: number
  ): Promise<Notification> {
    return this.notificationService.markNotificationAsRead(
      notificationId,
      userId,
      novelId
    );
  }
}
