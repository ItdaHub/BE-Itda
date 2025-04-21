import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Announcement } from "./announcement.entity";
import { User } from "../users/user.entity";
import { AnnouncementWithAdminDto } from "./dto/announcement.dto";

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
  ): Promise<AnnouncementWithAdminDto> {
    const newAnnouncement = this.announcementRepo.create({
      title,
      content,
      admin,
      priority,
    });
    const saved = await this.announcementRepo.save(newAnnouncement);
    return this.toDto(saved);
  }

  async deleteAnnouncement(id: number) {
    const found = await this.announcementRepo.findOne({ where: { id } });
    if (!found) throw new Error("해당 공지사항을 찾을 수 없습니다.");
    await this.announcementRepo.remove(found);
    return { message: "삭제되었습니다." };
  }

  async getAllAnnouncements(): Promise<AnnouncementWithAdminDto[]> {
    const announcements = await this.announcementRepo.find({
      relations: ["admin"],
      order: { start_date: "DESC" },
    });
    return announcements.map((a) => this.toDto(a));
  }

  async getAnnouncementById(id: number): Promise<AnnouncementWithAdminDto> {
    const announcement = await this.announcementRepo.findOne({
      where: { id },
      relations: ["admin"],
    });
    if (!announcement) {
      throw new NotFoundException("공지사항을 찾을 수 없습니다.");
    }
    return this.toDto(announcement);
  }

  async updateAnnouncement(
    id: number,
    title: string,
    content: string,
    priority: "urgent" | "normal" = "normal"
  ): Promise<AnnouncementWithAdminDto> {
    const announcement = await this.announcementRepo.findOne({
      where: { id },
      relations: ["admin"],
    });
    if (!announcement) {
      throw new NotFoundException(`Announcement with ID "${id}" not found`);
    }

    announcement.title = title;
    announcement.content = content;
    announcement.priority = priority;

    const updated = await this.announcementRepo.save(announcement);
    return this.toDto(updated);
  }

  // 🔄 Entity → DTO 변환 함수
  private toDto(entity: Announcement): AnnouncementWithAdminDto {
    const {
      id,
      title,
      content,
      priority,
      start_date,
      created_at,
      updated_at,
      admin,
    } = entity;
    return {
      id,
      title,
      content,
      priority,
      start_date,
      created_at,
      updated_at,
      admin: {
        id: admin.id,
        email: admin.email,
        nickname: admin.nickname,
      },
    };
  }
}
