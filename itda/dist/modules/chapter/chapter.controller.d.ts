import { ChapterService } from "./chapter.service";
import { CreateChapterDto } from "./dto/createchapter.dto";
export declare class ChapterController {
    private readonly chapterService;
    constructor(chapterService: ChapterService);
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
    createChapter(novelId: number, createChapterDto: CreateChapterDto, req: any): Promise<import("./entities/chapter.entity").Chapter>;
    hasUserParticipated(novelId: number, userId: number): Promise<{
        hasParticipated: boolean;
    }>;
    getIsPaidChapter(novelId: number, chapterId: number): Promise<{
        isPaid: boolean;
    }>;
}
