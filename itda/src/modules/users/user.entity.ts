import { IsEmail, IsString, IsOptional } from "class-validator";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Payment } from "../payments/payment.entity";
import { Novel } from "../novels/novel.entity";
import { Participant } from "../novels/participant.entity";
import { Chapter } from "../novels/chapter.entity";
import { Comment } from "../interactions/comment.entity";
import { Like } from "../likes/like.entity";
import { Report } from "../reports/report.entity";
import { Notification } from "../notifications/notification.entity";
import { Vote } from "../interactions/vote.entity";
import { Point } from "../payments/point.entity";

export enum LoginType {
  LOCAL = "local",
  KAKAO = "kakao",
  NAVER = "naver",
  GOOGLE = "google",
}

export enum UserType {
  ADMIN = "admin",
  USER = "user",
}

export enum UserStatus {
  ACTIVE = "active",
  BANNED = "banned",
  DELETED = "deleted",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ select: false })
  @IsString()
  password: string;

  @Column({ nullable: true })
  @IsOptional() // class-validator의 IsOptional
  @IsString()
  profile_img: string;

  @Column({ unique: true, nullable: true })
  @IsOptional() // class-validator의 IsOptional
  @IsString()
  phone: string;

  @Column({ type: "enum", enum: LoginType, default: LoginType.LOCAL })
  type: LoginType;

  @Column({ unique: true })
  @IsString()
  nickname: string;

  @Column({ default: 0 })
  age: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: "enum", enum: UserType })
  user_type: UserType;

  @Column({ type: "enum", enum: UserStatus })
  status: UserStatus;

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToMany(() => Novel, (novel) => novel.creator)
  novels: Novel[];

  @OneToMany(() => Participant, (participant) => participant.user)
  participants: Participant[];

  @OneToMany(() => Chapter, (chapter) => chapter.author)
  chapters: Chapter[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Report, (report) => report.reporter)
  reports: Report[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  @OneToMany(() => Point, (point) => point.user)
  points: Point[];
}
