import { Payment } from "src/modules/payments/entities/payment.entity";
import { Novel } from "../../novels/entities/novel.entity";
import { Participant } from "src/modules/novels/entities/participant.entity";
import { Chapter } from "../../chapter/entities/chapter.entity";
import { Comment } from "../../comments/entities/comment.entity";
import { Like } from "src/modules/likes/entities/like.entity";
import { Report } from "src/modules/reports/entities/report.entity";
import { Notification } from "../../notifications/entities/notification.entity";
import { Point } from "src/modules/points/entities/point.entity";
import { AnnouncementRead } from "../../announcement/entities/announcementread.entity";
import { Purchase } from "src/modules/points/entities/purchases.entity";
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
    STOP = "stop"
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
    password: string | null;
    profile_img: string | null;
    phone: string;
    type: LoginType;
    name?: string;
    nickname: string;
    birthYear?: string;
    created_at: Date;
    user_type: UserType;
    status: UserStatus;
    report_count: number;
    payments: Payment[];
    createdNovels: Novel[];
    authoredNovels: Novel[];
    participations: Participant[];
    chapters: Chapter[];
    comments: Comment[];
    likes: Like[];
    reports: Report[];
    notifications: Notification[];
    points: Point[];
    age_group?: number;
    announcementReads: AnnouncementRead[];
    purchases: Purchase[];
}
