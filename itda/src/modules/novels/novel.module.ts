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

@Module({
  imports: [
    TypeOrmModule.forFeature([Novel, Genre, Chapter, User, Participant]),
    UserModule,
  ],
  controllers: [NovelController],
  providers: [NovelService],
  exports: [NovelService],
})
export class NovelModule {}
