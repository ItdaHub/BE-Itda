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

  @ManyToOne(() => Novel, (novel) => novel.votes, { onDelete: "CASCADE" })
  novel: Novel;

  @ManyToOne(() => User, (user) => user.votes, { onDelete: "CASCADE" })
  user: User;

  @Column({ type: "enum", enum: ["agree", "disagree"] })
  result: "agree" | "disagree";

  @CreateDateColumn()
  created_at: Date;
}
