import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Announcement } from "./entities/announcement.entity";
import { User } from "../users/entities/user.entity";
import { AnnouncementWithAdminDto } from "./dto/announcement.dto";
import { AnnouncementRead } from "./entities/announcementread.entity";

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,
    @InjectRepository(AnnouncementRead)
    private readonly readRepository: Repository<AnnouncementRead>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async createAnnouncement(
    title: string,
    content: string,
    admin: User,
    priority: "urgent" | "normal" = "normal"
  ): Promise<AnnouncementWithAdminDto> {
    const newAnnouncement = this.announcementRepository.create({
      title,
      content,
      admin,
      priority,
    });
    const saved = await this.announcementRepository.save(newAnnouncement);
    return this.toDto(saved);
  }

  async deleteAnnouncement(id: number) {
    const found = await this.announcementRepository.findOne({ where: { id } });
    if (!found) throw new Error("해당 공지사항을 찾을 수 없습니다.");
    await this.announcementRepository.remove(found);
    return { message: "삭제되었습니다." };
  }

  /**
   * 공지사항 전체 조회
   * 로그인하지 않은 유저도 가능. userId가 주어지면 읽음 여부 포함
   */
  async getAllAnnouncements(
    userId?: number
  ): Promise<AnnouncementWithAdminDto[]> {
    const announcements = await this.announcementRepository.find({
      relations: ["admin"],
      order: { start_date: "DESC" },
    });

    let readIds = new Set<number>();
    if (userId) {
      const readAnnouncements = await this.readRepository.find({
        where: { user: { id: userId } },
        relations: ["announcement"],
      });
      readIds = new Set(readAnnouncements.map((read) => read.announcement.id));
    }

    return announcements.map((a) => {
      const isRead = userId ? readIds.has(a.id) : false; // 로그인한 경우만 읽음 여부 체크
      return this.toDto(a, isRead);
    });
  }

  async getAnnouncementById(id: number): Promise<AnnouncementWithAdminDto> {
    const announcement = await this.announcementRepository.findOne({
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
    const announcement = await this.announcementRepository.findOne({
      where: { id },
      relations: ["admin"],
    });
    if (!announcement) {
      throw new NotFoundException(`Announcement with ID "${id}" not found`);
    }

    announcement.title = title;
    announcement.content = content;
    announcement.priority = priority;

    const updated = await this.announcementRepository.save(announcement);
    return this.toDto(updated);
  }

  async markAsRead(announcementId: number, userId: number) {
    const announcement = await this.announcementRepository.findOne({
      where: { id: announcementId },
    });
    if (!announcement) throw new NotFoundException("공지사항이 없습니다.");

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException("사용자를 찾을 수 없습니다.");

    const alreadyRead = await this.readRepository.findOne({
      where: { announcement: { id: announcementId }, user: { id: userId } },
    });

    console.log(
      `공지사항 읽음 여부 확인: announcementId=${announcementId}, userId=${userId}`
    );
    if (alreadyRead) {
      console.log("이미 읽음 처리됨");
      return { message: "이미 읽음 처리됨" };
    }

    const read = this.readRepository.create({
      announcement,
      user,
      isRead: true,
    });
    await this.readRepository.save(read);

    console.log("읽음 처리 완료: announcementId=", announcementId);
    return { message: "읽음 처리 완료" };
  }

  private toDto(
    entity: Announcement,
    isRead: boolean = false
  ): AnnouncementWithAdminDto {
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
      isRead,
    };
  }
}
