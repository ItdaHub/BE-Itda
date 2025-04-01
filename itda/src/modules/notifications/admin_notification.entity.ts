import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "../users/user.entity";

@Entity("AdminNotification")
export class AdminNotification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  admin: User;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column("text")
  content: string;

  @Column({ type: "enum", enum: ["announcement", "report"] })
  type: "announcement" | "report";

  @Column({ type: "enum", enum: ["urgent", "important", "normal"] })
  priority: "urgent" | "important" | "normal";

  @Column({ default: false })
  is_read: boolean;

  @CreateDateColumn()
  created_at: Date;
}
