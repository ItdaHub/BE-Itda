import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
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

  @CreateDateColumn()
  readAt: Date;
}
