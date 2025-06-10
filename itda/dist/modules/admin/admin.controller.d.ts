import { NovelService } from "../novels/novel.service";
export declare class AdminController {
    private readonly novelService;
    constructor(novelService: NovelService);
    getNovelDetail(novelId: number): Promise<any>;
    getCompletedNovels(): Promise<{
        id: number;
        title: string;
        writer: string;
        date: string;
        status: import("../novels/entities/novel.entity").NovelStatus;
    }[]>;
    submitNovel(novelId: number): Promise<import("../novels/entities/novel.entity").Novel>;
    publishNovel(novelId: number): Promise<import("../novels/entities/novel.entity").Novel>;
    getWaitingNovels(): Promise<{
        id: number;
        title: string;
        writer: string;
        date: string;
        status: import("../novels/entities/novel.entity").NovelStatus;
    }[]>;
    deleteNovel(novelId: number): Promise<import("../novels/entities/novel.entity").Novel>;
}
