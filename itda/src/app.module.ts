import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static"; // ServeStaticModule 임포트
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
import { Payment } from "./modules/payments/payment.entity";
import { Point } from "./modules/points/point.entity";
import { AdminNotification } from "./modules/notifications/admin_notification.entity";
import { Announcement } from "./modules/announcement/announcement.entity";
import { AiModule } from "./modules/ai/ai.module";
import { GenreModule } from "./modules/genre/genre.module";
import { ChapterModule } from "./modules/chapter/chapter.module";
import { CommentsModule } from "./modules/comments/comment.module";
import { WritersModule } from "./modules/writers/writers.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { MailService } from "./modules/mail/mail.service";
import { PointModule } from "./modules/points/point.module";
import * as path from "path";
import * as handlebars from "handlebars";
import * as fs from "fs";
import { join } from "path";
import { AdminModule } from "./modules/admin/admin.modules";
import { AnnouncementModule } from "./modules/announcement/announcement.module";

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
        Payment,
        Point,
        AdminNotification,
        Announcement,
      ],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "uploads"), // 'uploads' 디렉토리 경로 설정
      serveRoot: "/uploads/", // URL 경로 설정
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
    PointModule,
    AdminModule,
    AnnouncementModule,
    MailerModule.forRoot({
      transport: {
        host: "smtp.gmail.com",
        secure: true,
        auth: {
          user: process.env.NODEMAILER_EMAIL,
          pass: process.env.NODEMAILER_PASSWORD_KEY,
        },
      },
      defaults: {
        from: '"ITDA" <no-reply@itda.com>',
      },
      template: {
        dir: path.join(__dirname, "./modules/mail/templates"),
        adapter: {
          compile: async (filePath: string, context: Record<string, any>) => {
            const template = handlebars.compile(
              await fs.promises.readFile(filePath, "utf-8")
            );
            return template(context);
          },
        },
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, LikeService, MailService],
})
export class AppModule {}
