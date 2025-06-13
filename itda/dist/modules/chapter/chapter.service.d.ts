import { Repository } from "typeorm";
import { Chapter } from "./entities/chapter.entity";
import { Novel } from "../novels/entities/novel.entity";
import { AiService } from "../ai/ai.service";
import { LikeService } from "../likes/like.service";
export declare class ChapterService {
    private readonly chapterRepository;
    private readonly novelRepository;
    private readonly aiService;
    private readonly likeService;
    constructor(chapterRepository: Repository<Chapter>, novelRepository: Repository<Novel>, aiService: AiService, likeService: LikeService);
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
        novelTitle: string;
        likesCount: number;
        prevChapterId: number | null;
        nextChapterId: number | null;
    }>;
    createChapter(novelId: number, content: string, user: any, chapterNumber?: number): Promise<Chapter>;
    hasUserParticipatedInNovel(novelId: number, userId: number): Promise<boolean>;
    checkIsPaid(novelId: number, chapterId: number): Promise<boolean>;
    updatePaidStatus(novelId: number): Promise<void>;
}
