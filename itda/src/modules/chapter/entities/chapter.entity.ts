import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Novel } from "../../novels/entities/novel.entity";
import { User } from "../../users/entities/user.entity";
import { Comment } from "../../comments/entities/comment.entity";
import { Report } from "src/modules/reports/entities/report.entity";

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

  @Column({ default: false })
  isPaid: boolean;
}
