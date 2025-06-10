import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentsService } from "./comment.service";
import { CommentsController } from "./comment.controller";
import { Comment } from "./entities/comment.entity";
import { User } from "../users/entities/user.entity";
import { Novel } from "../novels/entities/novel.entity";
import { Chapter } from "../chapter/entities/chapter.entity";
import { Report } from "../reports/entities/report.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Novel, Chapter, Report])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
