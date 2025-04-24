import { Repository } from "typeorm";
import { Chapter } from "./chapter.entity";
import { Novel } from "../novels/novel.entity";
import { AiService } from "../ai/ai.service";
export declare class ChapterService {
    private readonly chapterRepository;
    private readonly novelRepository;
    private readonly aiService;
    constructor(chapterRepository: Repository<Chapter>, novelRepository: Repository<Novel>, aiService: AiService);
    getChaptersByNovel(novelId: number): Promise<{
        id: number;
        chapter_number: number;
        content: string;
        created_at: Date;
        nickname: string;
        comments: any[];
        isPaid: boolean;
        isPublished: boolean;
    }[]>;
    getChapterContent(novelId: number, chapterId: number): Promise<{
        slides: {
            index: number;
            text: string;
        }[];
        authorNickname: string;
        writerId: number;
        chapterNumber: number;
        isLastChapter: boolean;
        isPublished: boolean;
    }>;
    createChapter(novelId: number, content: string, user: any, chapterNumber?: number): Promise<Chapter>;
    hasUserParticipatedInNovel(novelId: number, userId: number): Promise<boolean>;
    checkIsPaid(novelId: number, chapterId: number): Promise<boolean>;
    updatePaidStatus(novelId: number): Promise<void>;
}
