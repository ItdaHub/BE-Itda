import { User } from "../users/user.entity";
import { Genre } from "./genre.entity";
import { Participant } from "./participant.entity";
import { Chapter } from "./chapter.entity";
import { AIGeneratedImage } from "./ai_image.entity";
import { Like } from "../likes/like.entity";
import { Vote } from "../interactions/vote.entity";
import { Comment } from "../interactions/comment.entity";
import { Notification } from "../notifications/notification.entity";
export declare class Novel {
    id: number;
    title: string;
    creator: User;
    max_participants: 5 | 7 | 9;
    status: "ongoing" | "completed";
    cover_image: string;
    created_at: Date;
    genre: Genre;
    participants: Participant[];
    chapters: Chapter[];
    aiGeneratedImages: AIGeneratedImage[];
    likes: Like[];
    votes: Vote[];
    comments: Comment[];
    notifications: Notification[];
}
