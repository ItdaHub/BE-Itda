import { User } from "../users/user.entity";
import { Genre } from "../genre/genre.entity";
import { Participant } from "./participant.entity";
import { Chapter } from "../chapter/chapter.entity";
import { AIGeneratedImage } from "./ai_image.entity";
import { Like } from "../likes/like.entity";
import { Comment } from "../comments/comment.entity";
import { Notification } from "../notifications/notification.entity";
export declare enum MaxParticipants {
    FIVE = 5,
    SEVEN = 7,
    NINE = 9
}
export declare enum NovelStatus {
    ONGOING = "ongoing",
    COMPLETED = "completed",
    SUBMITTED = "submitted"
}
export declare enum NovelType {
    NEW = "new",
    RELAY = "relay"
}
export declare class Novel {
    id: number;
    title: string;
    creator: User;
    author: User;
    max_participants: MaxParticipants;
    status: NovelStatus;
    cover_image: string;
    type: NovelType;
    created_at: Date;
    genre: Genre;
    participants: Participant[];
    chapters: Chapter[];
    aiGeneratedImages: AIGeneratedImage[];
    likes: Like[];
    likeCount: number;
    comments: Comment[];
    notifications: Notification[];
    age_group: number;
    viewCount: number;
}
