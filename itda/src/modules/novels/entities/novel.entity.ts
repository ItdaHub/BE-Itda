import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Genre } from "src/modules/genre/entities/genre.entity";
import { Participant } from "./participant.entity";
import { Chapter } from "../../chapter/entities/chapter.entity";
import { AIGeneratedImage } from "./ai_image.entity";
import { Like } from "src/modules/likes/entities/like.entity";
import { Comment } from "../../comments/entities/comment.entity";
import { Notification } from "../../notifications/entities/notification.entity";

export enum MaxParticipants {
  FIVE = 5,
  SEVEN = 7,
  NINE = 9,
}

export enum NovelStatus {
  ONGOING = "ongoing",
  COMPLETED = "completed",
  SUBMITTED = "submitted",
}

export enum NovelType {
  NEW = "new",
  RELAY = "relay",
}

@Entity("novels")
export class Novel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  // ✅ 처음 소설 만든 사람 (방장 개념)
  @ManyToOne(() => User, (user) => user.createdNovels, {
    onDelete: "SET NULL",
    nullable: true,
  })
  creator: User;

  // ✅ 이 챕터를 실제로 작성한 사람 (참여자 중 한 명)
  @ManyToOne(() => User, (user) => user.authoredNovels, {
    onDelete: "SET NULL",
    nullable: true,
  })
  author: User;

  @Column({ type: "enum", enum: MaxParticipants })
  max_participants: MaxParticipants;

  @Column({
    type: "enum",
    enum: NovelStatus,
    default: NovelStatus.ONGOING,
  })
  status: NovelStatus;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: "enum", enum: NovelType, nullable: true })
  type: NovelType;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Genre, (genre) => genre.novels, {
    onDelete: "SET NULL",
    nullable: true,
  })
  genre: Genre;

  @Column({ default: false })
  isPublished: boolean;

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

  @OneToMany(() => Comment, (comment) => comment.novel)
  comments: Comment[];

  @OneToMany(() => Notification, (notification) => notification.novel)
  notifications: Notification[];

  @Column({ type: "int", nullable: true })
  age_group: number;

  @Column({ default: 0 })
  viewCount: number;
}
