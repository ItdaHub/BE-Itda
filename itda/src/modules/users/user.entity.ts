import { IsEmail, IsString, IsOptional } from "class-validator";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Unique,
} from "typeorm";
import { Payment } from "../payments/payment.entity";
import { Novel } from "../novels/novel.entity";
import { Participant } from "../novels/participant.entity";
import { Chapter } from "../chapter/chapter.entity";
import { Comment } from "../comments/comment.entity";
import { Like } from "../likes/like.entity";
import { Report } from "../reports/report.entity";
import { Notification } from "../notifications/notification.entity";
import { Point } from "../points/point.entity";

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

export enum AgeGroup {
  TEEN = "teen",
  TWENTIES = "twenties",
  THIRTIES = "thirties",
  FORTIES = "forties",
}

@Entity("users")
@Unique(["email", "type"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ select: false, nullable: true })
  @IsOptional()
  @IsString()
  password: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  profile_img: string;

  @Column({ unique: true, nullable: true })
  @IsOptional()
  @IsString()
  phone: string;

  @Column({ type: "enum", enum: LoginType, default: LoginType.LOCAL })
  type: LoginType;

  @Column({ nullable: true })
  name?: string;

  @Column({ unique: true })
  @IsString()
  nickname: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  birthYear?: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: "enum", enum: UserType, default: UserType.USER })
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

  @OneToMany(() => Point, (point) => point.user)
  points: Point[];

  @Column({ type: "int", nullable: true })
  @IsOptional()
  age_group?: number;
}
