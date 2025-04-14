import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./modules/users/user.module";
import { ReportModule } from "./modules/reports/report.module";
import { PaymentsModule } from "./modules/payments/payment.module";
import { NovelModule } from "./modules/novels/novel.module";
import { NotificationModule } from "./modules/notifications/notification.module";
import { LikeModule } from "./modules/likes/like.module";
import { AuthModule } from "./modules/auth/auth.module";
import { LikeService } from "./modules/likes/like.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./modules/users/user.entity";
import { Novel } from "./modules/novels/novel.entity";
import { Report } from "./modules/reports/report.entity";
import { Notification } from "./modules/notifications/notification.entity";
import { Genre } from "./modules/genre/genre.entity";
import { Participant } from "./modules/novels/participant.entity";
import { Chapter } from "./modules/chapter/chapter.entity";
import { Comment } from "./modules/comments/comment.entity";
import { Like } from "./modules/likes/like.entity";
import { AIGeneratedImage } from "./modules/novels/ai_image.entity";
import { Vote } from "./modules/interactions/vote.entity";
import { Payment } from "./modules/payments/payment.entity";
import { Point } from "./modules/payments/point.entity";
import { AdminNotification } from "./modules/notifications/admin_notification.entity";
import { Announcement } from "./modules/notifications/announcement.entity";
import { AiModule } from "./modules/ai/ai.module";
import { GenreModule } from "./modules/genre/genre.module";
import { ChapterModule } from "./modules/chapter/chapter.module";
import { CommentsModule } from "./modules/comments/comment.module";
import { WritersModule } from "./modules/writers/writers.module";
import { UserService } from "./modules/users/user.service";
import { MailModule } from "./modules/mail/mail.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "3306", 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        User,
        Novel,
        Participant,
        Genre,
        Notification,
        Report,
        Chapter,
        Comment,
        Like,
        AIGeneratedImage,
        Vote,
        Payment,
        Point,
        AdminNotification,
        Announcement,
      ],
      synchronize: true, // 개발 환경에서 true (배포 시 false로 설정)
    }),
    UserModule,
    ReportModule,
    PaymentsModule,
    NovelModule,
    NotificationModule,
    LikeModule,
    AuthModule,
    AiModule,
    GenreModule,
    ChapterModule,
    CommentsModule,
    WritersModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService, LikeService, UserService],
})
export class AppModule {}
