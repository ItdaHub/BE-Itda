import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chapter } from "./entities/chapter.entity";
import { ChapterService } from "./chapter.service";
import { ChapterController } from "./chapter.controller";
import { Novel } from "../novels/entities/novel.entity";
import { AiModule } from "../ai/ai.module";
import { LikeModule } from "../likes/like.module";

@Module({
  imports: [TypeOrmModule.forFeature([Chapter, Novel]), AiModule, LikeModule],
  providers: [ChapterService],
  controllers: [ChapterController],
})
export class ChapterModule {}
