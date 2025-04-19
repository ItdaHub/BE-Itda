import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Report } from "./report.entity";
import { Chapter } from "../chapter/chapter.entity";
import { Comment } from "../comments/comment.entity";
import { ReportService } from "./report.service";
import { ReportController } from "./report.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Report, Chapter, Comment])],
  providers: [ReportService],
  controllers: [ReportController],
})
export class ReportModule {}
