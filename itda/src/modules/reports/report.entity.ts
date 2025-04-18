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

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Notification, (notification) => notification.report, {
    cascade: true,
  })
  notifications: Notification[];
}
