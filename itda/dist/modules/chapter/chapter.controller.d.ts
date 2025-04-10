import { ChapterService } from "./chapter.service";
import { CreateChapterDto } from "./dto/createchapter.dto";
export declare class ChapterController {
    private readonly chapterService;
    constructor(chapterService: ChapterService);
    getChaptersByNovel(novelId: number): Promise<import("./chapter.entity").Chapter[]>;
    getChapterContent(chapterId: number): Promise<{
        index: number;
        text: string;
    }[] | null>;
    createChapter(novelId: number, createChapterDto: CreateChapterDto, req: any): Promise<import("./chapter.entity").Chapter>;
}
