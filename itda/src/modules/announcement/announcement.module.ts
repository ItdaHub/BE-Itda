import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Announcement } from "./announcement.entity";
import { AnnouncementService } from "./announcement.service";
import { AnnouncementController } from "./announcement.controller";
import { AnnouncementRead } from "./announcementread.entity";
import { UserModule } from "../users/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Announcement, AnnouncementRead]),
    UserModule,
  ],
  providers: [AnnouncementService],
  controllers: [AnnouncementController],
})
export class AnnouncementModule {}
