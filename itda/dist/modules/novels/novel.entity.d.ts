import { User } from "../users/user.entity";
import { Genre } from "../genre/genre.entity";
import { Participant } from "./participant.entity";
import { Chapter } from "../chapter/chapter.entity";
import { AIGeneratedImage } from "./ai_image.entity";
import { Like } from "../likes/like.entity";
import { Comment } from "../comments/comment.entity";
import { Notification } from "../notifications/notification.entity";
export declare class Novel {
    id: number;
    title: string;
    creator: User;
    max_participants: 5 | 7 | 9;
    status: "ongoing" | "completed" | "submitted";
    cover_image: string;
    type: "new" | "relay";
    created_at: Date;
    genre: Genre;
    participants: Participant[];
    chapters: Chapter[];
    aiGeneratedImages: AIGeneratedImage[];
    likes: Like[];
    likeCount: number;
    comments: Comment[];
    notifications: Notification[];
    author: User;
    age_group: number;
    viewCount: number;
}
