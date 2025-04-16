import { ChapterService } from "./chapter.service";
import { CreateChapterDto } from "./dto/createchapter.dto";
export declare class ChapterController {
    private readonly chapterService;
    constructor(chapterService: ChapterService);
    getChaptersByNovel(novelId: number): Promise<import("./chapter.entity").Chapter[]>;
    getChapterContent(novelId: number, chapterId: number): Promise<{
        slides: {
            index: number;
            text: string;
        }[];
        authorNickname: string;
        writerId: number;
        chapterNumber: number;
        isLastChapter: boolean;
    }>;
    createChapter(novelId: number, createChapterDto: CreateChapterDto, req: any): Promise<import("./chapter.entity").Chapter>;
    hasUserParticipated(novelId: number, userId: number): Promise<{
        hasParticipated: boolean;
    }>;
}
