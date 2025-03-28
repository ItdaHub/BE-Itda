import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VoteModule } from './modules/votes/vote.module';
import { AdminModule } from './modules/admin/admin.module';
import { AiModule } from './modules/ai/ai.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommentModule } from './modules/comment/comment.module';
import { LikeModule } from './modules/like/like.module';
import { StoryModule } from './modules/story/story.module';

@Module({
  imports: [VoteModule, AdminModule, AiModule, AuthModule, CommentModule, LikeModule, StoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
