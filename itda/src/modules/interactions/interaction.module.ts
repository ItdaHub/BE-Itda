import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InteractionsController } from "./interaction.controller";
import { InteractionsService } from "./interaction.service";
import { Vote } from "./vote.entity";
import { Comment } from "./comment.entity";
import { Novel } from "../novels/novel.entity";
import { User } from "../users/user.entity";
import { Chapter } from "../novels/chapter.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Vote, Comment, Novel, User, Chapter])],
  controllers: [InteractionsController],
  providers: [InteractionsService],
})
export class InteractionsModule {}
