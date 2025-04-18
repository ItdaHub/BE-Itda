import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Novel } from "../novels/novel.entity";
import { User } from "../users/user.entity";
import { Comment } from "../comments/comment.entity";
import { Report } from "../reports/report.entity";

@Entity("chapters")
export class Chapter {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Novel, (novel) => novel.chapters, { onDelete: "CASCADE" })
  novel: Novel;

  @ManyToOne(() => User, (user) => user.chapters, { onDelete: "CASCADE" })
  author: User;

  @Column("text")
  content: string;

  @Column({ type: "int" })
  chapter_number: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Comment, (comment) => comment.chapter)
  comments: Comment[];

  @OneToMany(() => Report, (report) => report.chapter)
  reports: Report[];
}
