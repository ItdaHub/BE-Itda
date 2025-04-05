import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentsService } from "./comment.service";
import { CommentsController } from "./comment.controller";
import { Comment } from "./comment.entity";
import { User } from "../users/user.entity";
import { Novel } from "../novels/novel.entity";
import { Chapter } from "../chapter/chapter.entity";
import { Report } from "../reports/report.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Novel, Chapter, Report])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
