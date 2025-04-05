import { Repository } from "typeorm";
import { Chapter } from "./chapter.entity";
import { Novel } from "../novels/novel.entity";
export declare class ChapterService {
    private readonly chapterRepository;
    private readonly novelRepository;
    constructor(chapterRepository: Repository<Chapter>, novelRepository: Repository<Novel>);
    getChaptersByNovel(novelId: number): Promise<Chapter[]>;
    getChapterContent(chapterId: number): Promise<{
        index: number;
        text: string;
    }[] | null>;
}
