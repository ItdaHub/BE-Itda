import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Notification } from "./entities/notification.entity";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";
import { User } from "../users/entities/user.entity";
import { Novel } from "../novels/entities/novel.entity";
import { Report } from "../reports/entities/report.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User, Novel, Report])],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
