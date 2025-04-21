import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../users/user.entity";
import { AnnouncementRead } from "./announcementread.entity";

@Entity("Announcement")
export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column("text")
  content: string;

  @ManyToOne(() => User, (user) => user.id)
  admin: User;

  @Column({ type: "enum", enum: ["urgent", "normal"], default: "normal" })
  priority: "urgent" | "normal";

  @CreateDateColumn()
  start_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => AnnouncementRead, (read) => read.announcement)
  reads: AnnouncementRead[];
}
