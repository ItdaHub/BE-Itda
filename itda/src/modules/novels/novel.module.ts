import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Novel } from "./novel.entity";
import { NovelService } from "./novel.service";
import { NovelController } from "./novel.controller";
import { Participant } from "./participant.entity";
import { Chapter } from "./chapter.entity";
import { Genre } from "./genre.entity";
import { AIGeneratedImage } from "./ai_image.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Novel,
      Participant,
      Chapter,
      Genre,
      AIGeneratedImage,
    ]),
  ],
  controllers: [NovelController],
  providers: [NovelService],
  exports: [NovelService],
})
export class NovelModule {}
