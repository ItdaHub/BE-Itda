import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "../users/user.entity";
import { Novel } from "../novels/novel.entity";
import { Report } from "../reports/report.entity";

export enum NotificationType {
  VOTE = "vote",
  REPORT = "report",
}

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: "CASCADE" })
  user: User;

  @Column({ type: "enum", enum: NotificationType })
  type: NotificationType;

  @ManyToOne(() => Novel, (novel) => novel.notifications, {
    nullable: true,
    onDelete: "CASCADE",
  })
  novel: Novel | null;

  @ManyToOne(() => Report, (report) => report.notifications, {
    nullable: true,
    onDelete: "CASCADE",
  })
  report: Report | null;

  @Column("text")
  content: string;

  @Column({ default: false })
  is_read: boolean;

  @CreateDateColumn()
  created_at: Date;
}
