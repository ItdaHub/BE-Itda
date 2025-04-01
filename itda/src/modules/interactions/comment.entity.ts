import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "../users/user.entity";
import { Novel } from "../novels/novel.entity";
import { Chapter } from "../novels/chapter.entity";
import { Like } from "../likes/like.entity";

@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Novel, (novel) => novel.comments, { onDelete: "CASCADE" })
  novel: Novel;

  @ManyToOne(() => Chapter, (chapter) => chapter.comments, {
    nullable: true,
    onDelete: "CASCADE",
  })
  chapter: Chapter | null;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: "CASCADE" })
  user: User;

  @Column("text")
  content: string;

  @ManyToOne(() => Comment, (comment) => comment.childComments, {
    nullable: true,
    onDelete: "CASCADE",
  })
  parent_comment: Comment | null;

  @OneToMany(() => Comment, (comment) => comment.parent_comment)
  childComments: Comment[];

  @OneToMany(() => Like, (like) => like.comment) // 🔹 추가 (좋아요 관계 설정)
  likes: Like[];

  @CreateDateColumn()
  created_at: Date;
}
