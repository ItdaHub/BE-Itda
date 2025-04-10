import { Module } from "@nestjs/common";
import { AiController } from "./ai.controller";
import { AiService } from "./ai.service";
import { NovelModule } from "../novels/novel.module"; // <- 이거 추가

@Module({
  imports: [NovelModule], // <- 이거 꼭 필요
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
