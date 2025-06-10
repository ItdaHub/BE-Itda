import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  CreateDateColumn,
  Column,
} from "typeorm";
import { User } from "src/modules/users/entities/user.entity";
import { Novel } from "src/modules/novels/entities/novel.entity";

@Entity("recent_novels")
@Unique(["user", "novel", "chapterNumber"])
export class RecentNovel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Novel, { eager: true, onDelete: "CASCADE" })
  novel: Novel;

  @Column()
  chapterNumber: number;

  @CreateDateColumn()
  viewedAt: Date;
}
