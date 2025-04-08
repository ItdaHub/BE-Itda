import { Payment } from "../payments/payment.entity";
import { Novel } from "../novels/novel.entity";
import { Participant } from "../novels/participant.entity";
import { Chapter } from "../chapter/chapter.entity";
import { Comment } from "../comments/comment.entity";
import { Like } from "../likes/like.entity";
import { Report } from "../reports/report.entity";
import { Notification } from "../notifications/notification.entity";
import { Vote } from "../interactions/vote.entity";
import { Point } from "../payments/point.entity";
export declare enum LoginType {
    LOCAL = "local",
    KAKAO = "kakao",
    NAVER = "naver",
    GOOGLE = "google"
}
export declare enum UserType {
    ADMIN = "admin",
    USER = "user"
}
export declare enum UserStatus {
    ACTIVE = "active",
    BANNED = "banned",
    DELETED = "deleted"
}
export declare enum AgeGroup {
    TEEN = "teen",
    TWENTIES = "twenties",
    THIRTIES = "thirties",
    FORTIES = "forties"
}
export declare class User {
    id: number;
    email: string;
    password: string;
    profile_img: string;
    phone: string;
    type: LoginType;
    name?: string;
    nickname: string;
    birthYear?: string;
    created_at: Date;
    user_type: UserType;
    status: UserStatus;
    payments: Payment[];
    novels: Novel[];
    participants: Participant[];
    chapters: Chapter[];
    comments: Comment[];
    likes: Like[];
    reports: Report[];
    notifications: Notification[];
    votes: Vote[];
    points: Point[];
    age_group?: number;
}
