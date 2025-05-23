import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NovelController } from "./novel.controller";
import { NovelService } from "./novel.service";
import { Novel } from "./novel.entity";
import { Genre } from "../genre/genre.entity";
import { Chapter } from "../chapter/chapter.entity";
import { User } from "../users/user.entity";
import { UserModule } from "../users/user.module";
import { Participant } from "./participant.entity";
import { NotificationModule } from "../notifications/notification.module";
import { AiService } from "../ai/ai.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Novel, Genre, Chapter, User, Participant]),
    UserModule,
    NotificationModule,
  ],
  controllers: [NovelController],
  providers: [NovelService, AiService],
  exports: [NovelService],
})
export class NovelModule {}
