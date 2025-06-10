import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Like } from "./entities/like.entity";
import { LikeService } from "./like.service";
import { LikeController } from "./like.controller";
import { Novel } from "../novels/entities/novel.entity";
import { Comment } from "../comments/entities/comment.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Like, Novel, Comment])],
  providers: [LikeService],
  controllers: [LikeController],
})
export class LikeModule {}
