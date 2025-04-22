import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
} from "typeorm";
import { User } from "../users/user.entity";
import { Announcement } from "./announcement.entity";

@Entity("announcement_reads")
export class AnnouncementRead {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.announcementReads, {
    onDelete: "CASCADE",
  })
  user: User;

  @ManyToOne(() => Announcement, (announcement) => announcement.reads, {
    onDelete: "CASCADE",
  })
  announcement: Announcement;

  @Column({ default: false })
  isRead: boolean; // 읽음 여부 필드 추가

  @CreateDateColumn()
  readAt: Date;
}
