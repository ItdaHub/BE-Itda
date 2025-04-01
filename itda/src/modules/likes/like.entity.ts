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
import { Comment } from "../interactions/comment.entity";

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
  novel: Novel | null; // 소설 좋아요

  @ManyToOne(() => Comment, (comment) => comment.likes, {
    onDelete: "CASCADE",
    nullable: true,
  })
  comment: Comment | null; // 댓글 좋아요

  @CreateDateColumn()
  created_at: Date;
}
