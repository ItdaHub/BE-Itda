import { ChapterService } from "./chapter.service";
export declare class ChapterController {
    private readonly chapterService;
    constructor(chapterService: ChapterService);
    getChaptersByNovel(novelId: number): Promise<import("./chapter.entity").Chapter[]>;
    getChapterContent(chapterId: number): Promise<{
        index: number;
        text: string;
    }[] | null>;
}
