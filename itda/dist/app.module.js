"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const serve_static_1 = require("@nestjs/serve-static");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_module_1 = require("./modules/users/user.module");
const report_module_1 = require("./modules/reports/report.module");
const payment_module_1 = require("./modules/payments/payment.module");
const novel_module_1 = require("./modules/novels/novel.module");
const notification_module_1 = require("./modules/notifications/notification.module");
const like_module_1 = require("./modules/likes/like.module");
const auth_module_1 = require("./modules/auth/auth.module");
const like_service_1 = require("./modules/likes/like.service");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./modules/users/entities/user.entity");
const novel_entity_1 = require("./modules/novels/entities/novel.entity");
const report_entity_1 = require("./modules/reports/entities/report.entity");
const notification_entity_1 = require("./modules/notifications/entities/notification.entity");
const genre_entity_1 = require("./modules/genre/entities/genre.entity");
const participant_entity_1 = require("./modules/novels/entities/participant.entity");
const chapter_entity_1 = require("./modules/chapter/entities/chapter.entity");
const comment_entity_1 = require("./modules/comments/entities/comment.entity");
const like_entity_1 = require("./modules/likes/entities/like.entity");
const ai_image_entity_1 = require("./modules/novels/entities/ai_image.entity");
const payment_entity_1 = require("./modules/payments/entities/payment.entity");
const point_entity_1 = require("./modules/points/entities/point.entity");
const tag_entity_1 = require("./modules/novels/entities/tag.entity");
const admin_notification_entity_1 = require("./modules/notifications/entities/admin_notification.entity");
const announcement_entity_1 = require("./modules/announcement/entities/announcement.entity");
const announcementread_entity_1 = require("./modules/announcement/entities/announcementread.entity");
const recentNovel_entity_1 = require("./modules/novels/entities/recentNovel.entity");
const ai_module_1 = require("./modules/ai/ai.module");
const genre_module_1 = require("./modules/genre/genre.module");
const chapter_module_1 = require("./modules/chapter/chapter.module");
const comment_module_1 = require("./modules/comments/comment.module");
const mailer_1 = require("@nestjs-modules/mailer");
const mail_service_1 = require("./modules/mail/mail.service");
const point_module_1 = require("./modules/points/point.module");
const path = require("path");
const handlebars = require("handlebars");
const fs = require("fs");
const path_1 = require("path");
const admin_modules_1 = require("./modules/admin/admin.modules");
const announcement_module_1 = require("./modules/announcement/announcement.module");
const banner_module_1 = require("./modules/banner/banner.module");
const banner_entity_1 = require("./modules/banner/entities/banner.entity");
const purchases_entity_1 = require("./modules/points/entities/purchases.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ".env",
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: "mysql",
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT || "3306", 10),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                entities: [
                    user_entity_1.User,
                    novel_entity_1.Novel,
                    participant_entity_1.Participant,
                    genre_entity_1.Genre,
                    notification_entity_1.Notification,
                    report_entity_1.Report,
                    chapter_entity_1.Chapter,
                    comment_entity_1.Comment,
                    like_entity_1.Like,
                    ai_image_entity_1.AIGeneratedImage,
                    payment_entity_1.Payment,
                    point_entity_1.Point,
                    admin_notification_entity_1.AdminNotification,
                    announcement_entity_1.Announcement,
                    announcementread_entity_1.AnnouncementRead,
                    banner_entity_1.Banner,
                    purchases_entity_1.Purchase,
                    recentNovel_entity_1.RecentNovel,
                    tag_entity_1.Tag,
                ],
                synchronize: true,
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, "..", "uploads"),
                serveRoot: "/uploads/",
            }),
            user_module_1.UserModule,
            report_module_1.ReportModule,
            payment_module_1.PaymentsModule,
            novel_module_1.NovelModule,
            notification_module_1.NotificationModule,
            like_module_1.LikeModule,
            auth_module_1.AuthModule,
            ai_module_1.AiModule,
            genre_module_1.GenreModule,
            chapter_module_1.ChapterModule,
            comment_module_1.CommentsModule,
            point_module_1.PointModule,
            admin_modules_1.AdminModule,
            announcement_module_1.AnnouncementModule,
            banner_module_1.BannerModule,
            mailer_1.MailerModule.forRoot({
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
                        compile: async (filePath, context) => {
                            const template = handlebars.compile(await fs.promises.readFile(filePath, "utf-8"));
                            return template(context);
                        },
                    },
                    options: {
                        strict: true,
                    },
                },
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, like_service_1.LikeService, mail_service_1.MailService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map