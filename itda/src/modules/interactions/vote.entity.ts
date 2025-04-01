import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Novel } from "../novels/novel.entity";
import { User } from "../users/user.entity";

@Entity("votes")
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  // ManyToOne 관계에서 novel 객체와 연결
  @ManyToOne(() => Novel, (novel) => novel.votes, { onDelete: "CASCADE" })
  novel: Novel;

  // ManyToOne 관계에서 user 객체와 연결
  @ManyToOne(() => User, (user) => user.votes, { onDelete: "CASCADE" })
  user: User;

  @Column({ type: "enum", enum: ["agree", "disagree"] })
  result: "agree" | "disagree";

  @CreateDateColumn()
  created_at: Date;
}
