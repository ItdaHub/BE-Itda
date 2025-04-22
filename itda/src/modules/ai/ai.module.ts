import { Module, forwardRef } from "@nestjs/common";
import { AiController } from "./ai.controller";
import { AiService } from "./ai.service";
import { NovelModule } from "../novels/novel.module";

@Module({
  imports: [forwardRef(() => NovelModule)],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
