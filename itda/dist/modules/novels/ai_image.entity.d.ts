import { Novel } from "./novel.entity";
import { Chapter } from "./chapter.entity";
export declare class AIGeneratedImage {
    id: number;
    novel: Novel;
    chapter: Chapter | null;
    image_url: string;
    created_at: Date;
}
