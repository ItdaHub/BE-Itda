import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Novel } from "../../novels/entities/novel.entity";
import { Report } from "src/modules/reports/entities/report.entity";

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: "CASCADE" })
  user: User;

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

  @Column({ type: "enum", enum: ["REPORT", "NOVEL_SUBMIT"], default: "REPORT" })
  type: "REPORT" | "NOVEL_SUBMIT";
}
