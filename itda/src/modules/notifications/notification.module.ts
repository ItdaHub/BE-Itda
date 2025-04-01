import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Notification } from "./notification.entity";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";
import { User } from "../users/user.entity";
import { Novel } from "../novels/novel.entity";
import { Report } from "../reports/report.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User, Novel, Report])],
  providers: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
