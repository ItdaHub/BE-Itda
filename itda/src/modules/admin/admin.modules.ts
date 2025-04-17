import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { NovelModule } from "../novels/novel.module";

@Module({
  imports: [NovelModule],
  controllers: [AdminController],
})
export class AdminModule {}
