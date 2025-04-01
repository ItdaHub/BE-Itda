import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Like } from "./like.entity";
import { LikeService } from "./like.service";
import { LikeController } from "./like.controller";
import { Novel } from "../novels/novel.entity";
import { Comment } from "../interactions/comment.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Like, Novel, Comment])],
  providers: [LikeService],
  controllers: [LikeController],
})
export class LikeModule {}
