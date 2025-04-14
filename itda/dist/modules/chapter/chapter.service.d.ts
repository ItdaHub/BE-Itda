import { Repository } from "typeorm";
import { Chapter } from "./chapter.entity";
import { Novel } from "../novels/novel.entity";
export declare class ChapterService {
    private readonly chapterRepository;
    private readonly novelRepository;
    constructor(chapterRepository: Repository<Chapter>, novelRepository: Repository<Novel>);
    getChaptersByNovel(novelId: number): Promise<Chapter[]>;
    getChapterContent(novelId: number, chapterId: number): Promise<{
        slides: {
            index: number;
            text: string;
        }[];
        authorNickname: string;
        writerId: number;
        chapterNumber: number;
    }>;
    createChapter(novelId: number, content: string, user: any, chapterNumber?: number): Promise<Chapter>;
    hasUserParticipatedInNovel(novelId: number, userId: number): Promise<boolean>;
}
