import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "../users/user.entity";
import { Genre } from "../genre/genre.entity";
import { Participant } from "./participant.entity";
import { Chapter } from "../chapter/chapter.entity";
import { AIGeneratedImage } from "./ai_image.entity";
import { Like } from "../likes/like.entity";
import { Vote } from "../interactions/vote.entity";
import { Comment } from "../comments/comment.entity";
import { Notification } from "../notifications/notification.entity";

@Entity("novels")
export class Novel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @ManyToOne(() => User, (user) => user.novels, { onDelete: "CASCADE" })
  creator: User;

  @Column({ type: "enum", enum: [5, 7, 9] })
  max_participants: 5 | 7 | 9;

  @Column({ type: "enum", enum: ["ongoing", "completed"] })
  status: "ongoing" | "completed";

  @Column({ length: 255, nullable: true })
  cover_image: string;

  @Column({ type: "enum", enum: ["new", "relay"], nullable: true })
  type: "new" | "relay";

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Genre, (genre) => genre.novels, { onDelete: "SET NULL" })
  genre: Genre;

  @OneToMany(() => Participant, (participant) => participant.novel)
  participants: Participant[];

  @OneToMany(() => Chapter, (chapter) => chapter.novel)
  chapters: Chapter[];

  @OneToMany(() => AIGeneratedImage, (image) => image.novel)
  aiGeneratedImages: AIGeneratedImage[];

  @OneToMany(() => Like, (like) => like.novel)
  likes: Like[];

  @Column({ default: 0 })
  likeCount: number;

  @OneToMany(() => Vote, (vote) => vote.novel)
  votes: Vote[];

  @OneToMany(() => Comment, (comment) => comment.novel)
  comments: Comment[];

  @OneToMany(() => Notification, (notification) => notification.novel)
  notifications: Notification[];

  @ManyToOne(() => User, (user) => user.novels)
  author: User;

  @Column({ type: "int", nullable: true })
  age_group: number;

  @Column({ default: 0 })
  viewCount: number;
}
