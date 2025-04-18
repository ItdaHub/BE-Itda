import { NovelService } from "../novels/novel.service";
export declare class AdminController {
    private readonly novelService;
    constructor(novelService: NovelService);
    getNovelDetail(novelId: number): Promise<any>;
    submitNovel(novelId: number): Promise<import("../novels/novel.entity").Novel>;
    getCompletedNovels(): Promise<{
        id: number;
        title: string;
        writer: string;
        date: string;
        status: import("../novels/novel.entity").NovelStatus;
    }[]>;
    deleteNovel(novelId: number): Promise<import("../novels/novel.entity").Novel>;
    publishNovel(novelId: number): Promise<import("../novels/novel.entity").Novel>;
}
