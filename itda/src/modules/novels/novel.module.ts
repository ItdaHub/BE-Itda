import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NovelController } from "./novel.controller";
import { NovelService } from "./novel.service";
import { RecentNovelService } from "./recentNovel.service";
import { Novel } from "./entities/novel.entity";
import { RecentNovel } from "./entities/recentNovel.entity";
import { Genre } from "../genre/entities/genre.entity";
import { Chapter } from "../chapter/entities/chapter.entity";
import { User } from "../users/entities/user.entity";
import { UserModule } from "../users/user.module";
import { Participant } from "./entities/participant.entity";
import { Tag } from "./entities/tag.entity";
import { NotificationModule } from "../notifications/notification.module";
import { AiService } from "../ai/ai.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Novel,
      Genre,
      Chapter,
      User,
      Participant,
      RecentNovel,
      Tag,
    ]),
    UserModule,
    NotificationModule,
  ],
  controllers: [NovelController],
  providers: [NovelService, AiService, RecentNovelService],
  exports: [NovelService, RecentNovelService],
})
export class NovelModule {}
