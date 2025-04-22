import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Announcement } from "./announcement.entity";
import { User } from "../users/user.entity";
import { AnnouncementWithAdminDto } from "./dto/announcement.dto";
import { AnnouncementRead } from "./announcementread.entity";

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepo: Repository<Announcement>,
    @InjectRepository(AnnouncementRead)
    private readonly readRepo: Repository<AnnouncementRead>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
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

  async markAsRead(announcementId: number, userId: number) {
    console.log("📥 markAsRead 호출됨:", { announcementId, userId });

    const announcement = await this.announcementRepo.findOne({
      where: { id: announcementId },
    });
    if (!announcement) {
      console.log("❌ 공지사항 없음");
      throw new NotFoundException("공지사항이 없습니다.");
    }
    console.log("✅ 공지사항 찾음:", announcement);

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      console.log("❌ 사용자 없음");
      throw new NotFoundException("사용자를 찾을 수 없습니다.");
    }
    console.log("✅ 사용자 찾음:", user);

    const alreadyRead = await this.readRepo.findOne({
      where: {
        announcement: { id: announcementId },
        user: { id: userId },
      },
    });

    if (alreadyRead) {
      console.log("🔁 이미 읽음 처리됨");
    } else {
      console.log("🆕 읽음 기록 없음, 저장 시도");
      const read = this.readRepo.create({
        announcement,
        user,
      });
      await this.readRepo.save(read);
      console.log("💾 읽음 처리 저장 완료");
    }

    return { message: "읽음 처리 완료" };
  }

  async getUnreadAnnouncements(userId: number) {
    const allAnnouncements = await this.announcementRepo.find({
      relations: ["admin"],
      order: { start_date: "DESC" },
    });

    const readAnnouncements = await this.readRepo.find({
      where: { user: { id: userId } },
      relations: ["announcement"],
    });

    const readIds = new Set(
      readAnnouncements.map((read) => read.announcement.id)
    );
    const unread = allAnnouncements.filter((a) => !readIds.has(a.id));

    return unread.map((a) => this.toDto(a));
  }
}
