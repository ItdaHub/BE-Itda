import { User } from "../../users/entities/user.entity";
import { Genre } from "src/modules/genre/entities/genre.entity";
import { Participant } from "./participant.entity";
import { Chapter } from "../../chapter/entities/chapter.entity";
import { AIGeneratedImage } from "./ai_image.entity";
import { Like } from "src/modules/likes/entities/like.entity";
import { Comment } from "../../comments/entities/comment.entity";
import { Notification } from "../../notifications/entities/notification.entity";
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
    imageUrl: string;
    type: NovelType;
    created_at: Date;
    genre: Genre;
    isPublished: boolean;
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
