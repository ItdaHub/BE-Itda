import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Report } from "./entities/report.entity";
import { ReportController } from "./report.controller";
import { ReportService } from "./report.service";

import { Comment } from "../comments/entities/comment.entity";
import { Chapter } from "../chapter/entities/chapter.entity";
import { User } from "../users/entities/user.entity";
import { Notification } from "../notifications/entities/notification.entity";

import { UserModule } from "../users/user.module";
import { CommentsModule } from "..//comments/comment.module";
import { ChapterModule } from "../chapter/chapter.module";
import { NotificationModule } from "../notifications/notification.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Report, Comment, Chapter, User, Notification]),
    UserModule,
    CommentsModule,
    ChapterModule,
    NotificationModule,
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
