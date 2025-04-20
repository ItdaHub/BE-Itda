import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { User } from "../users/user.entity";
import { Notification } from "../notifications/notification.entity";
import { Chapter } from "../chapter/chapter.entity";

export enum TargetType {
  CHAPTER = "chapter",
  COMMENT = "comment",
}

@Entity("reports")
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reports, { onDelete: "CASCADE" })
  reporter: User;

  @Column({ type: "enum", enum: TargetType })
  target_type: TargetType;

  @Column()
  target_id: number;

  @Column("text")
  reason: string;

  @Column("text", { nullable: true })
  reported_content: string;

  @ManyToOne(() => Chapter, (chapter) => chapter.reports, {
    onDelete: "CASCADE",
  })
  chapter: Chapter;

  @Column({ nullable: true })
  reported_user_id?: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Notification, (notification) => notification.report, {
    cascade: true,
  })
  notifications: Notification[];

  @Column({ default: false })
  handled: boolean;
}
