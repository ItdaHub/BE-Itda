import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  CreateDateColumn,
} from "typeorm";
import { User } from "src/modules/users/entities/user.entity";
import { Novel } from "src/modules/novels/entities/novel.entity";

@Entity("recent_novels")
@Unique(["user", "novel"]) // 동일 유저가 동일 소설을 여러 번 기록하지 않게
export class RecentNovel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Novel, { eager: true, onDelete: "CASCADE" })
  novel: Novel;

  @CreateDateColumn()
  viewedAt: Date;
}
