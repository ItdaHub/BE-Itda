import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chapter } from "./chapter.entity";
import { ChapterService } from "./chapter.service";
import { ChapterController } from "./chapter.controller";
import { Novel } from "../novels/novel.entity";
import { AiModule } from "../ai/ai.module";

@Module({
  imports: [TypeOrmModule.forFeature([Chapter, Novel]), AiModule],
  providers: [ChapterService],
  controllers: [ChapterController],
})
export class ChapterModule {}
