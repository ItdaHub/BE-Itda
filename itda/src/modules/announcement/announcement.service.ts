import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Announcement } from "./announcement.entity";
import { User } from "../users/user.entity";

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepo: Repository<Announcement>
  ) {}

  async createAnnouncement(
    title: string,
    content: string,
    admin: User,
    priority: "urgent" | "normal" = "normal"
  ) {
    const newAnnouncement = this.announcementRepo.create({
      title,
      content,
      admin,
      priority,
    });
    return await this.announcementRepo.save(newAnnouncement);
  }

  async deleteAnnouncement(id: number) {
    const found = await this.announcementRepo.findOne({ where: { id } });
    if (!found) throw new Error("해당 공지사항을 찾을 수 없습니다.");
    await this.announcementRepo.remove(found);
    return { message: "삭제되었습니다." };
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    const announcements = await this.announcementRepo.find({
      relations: ["admin"],
    });
    console.log("📜 모든 공지사항 조회 결과:", announcements);
    return announcements;
  }

  async updateAnnouncement(
    id: number,
    title: string,
    content: string,
    priority: "urgent" | "normal" = "normal"
  ) {
    const announcement = await this.announcementRepo.findOneBy({ id });
    if (!announcement) {
      throw new NotFoundException(`Announcement with ID "${id}" not found`);
    }
    announcement.title = title;
    announcement.content = content;
    if (priority) {
      announcement.priority = priority;
    }
    return this.announcementRepo.save(announcement);
  }

  async getAnnouncementById(id: number) {
    console.log("🔍 ID 조회 시도:", id);
    const announcement = await this.announcementRepo.findOne({ where: { id } });
    console.log("✅ 조회 결과:", announcement);
    if (!announcement) {
      throw new NotFoundException("공지사항을 찾을 수 없습니다.");
    }
    return announcement;
  }
}
