import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../users/user.entity";
import { Novel } from "./novel.entity";

@Entity("participants")
export class Participant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Novel, (novel) => novel.participants, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "novel_id" })
  novel: Novel;

  @ManyToOne(() => User, (user) => user.participants, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "int" })
  order_number: number;

  @CreateDateColumn()
  joined_at: Date;
}
