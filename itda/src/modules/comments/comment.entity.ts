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
import { Chapter } from "../chapter/chapter.entity";
import { Like } from "../likes/like.entity";

@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  content: string;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Novel, (novel) => novel.comments, {
    nullable: true,
    onDelete: "CASCADE",
  })
  novel: Novel | null;

  @ManyToOne(() => Chapter, (chapter) => chapter.comments, {
    nullable: true,
    onDelete: "CASCADE",
  })
  chapter: Chapter | null;

  @ManyToOne(() => Comment, (comment) => comment.childComments, {
    nullable: true,
    onDelete: "CASCADE",
  })
  parent_comment: Comment | null;

  @OneToMany(() => Comment, (comment) => comment.parent_comment)
  childComments: Comment[];

  @OneToMany(() => Like, (like) => like.comment)
  likes: Like[];

  @CreateDateColumn()
  created_at: Date;
}
