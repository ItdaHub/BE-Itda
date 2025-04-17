import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InteractionsController } from "./interaction.controller";
import { InteractionsService } from "./interaction.service";
import { Comment } from "../comments/comment.entity";
import { Novel } from "../novels/novel.entity";
import { User } from "../users/user.entity";
import { Chapter } from "../chapter/chapter.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Novel, User, Chapter])],
  controllers: [InteractionsController],
  providers: [InteractionsService],
})
export class InteractionsModule {}
