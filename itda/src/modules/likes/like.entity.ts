import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Check,
} from "typeorm";
import { User } from "../users/user.entity";
import { Novel } from "../novels/novel.entity";
import { Comment } from "../comments/comment.entity";

@Entity("likes")
@Check(`(target_type = 'novel' AND novel_id IS NOT NULL AND comment_id IS NULL) OR 
        (target_type = 'comment' AND comment_id IS NOT NULL AND novel_id IS NULL)`)
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: "CASCADE" })
  user: User;

  @Column({ type: "enum", enum: ["novel", "comment"] })
  target_type: "novel" | "comment";

  @ManyToOne(() => Novel, (novel) => novel.likes, {
    onDelete: "CASCADE",
    nullable: true,
  })
  novel: Novel | null;

  @ManyToOne(() => Comment, (comment) => comment.likes, {
    onDelete: "CASCADE",
    nullable: true,
  })
  comment: Comment | null;

  @CreateDateColumn()
  created_at: Date;
}
