import { NovelService } from "../novels/novel.service";
export declare class AdminController {
    private readonly novelService;
    constructor(novelService: NovelService);
    submitNovel(novelId: number): Promise<import("../novels/novel.entity").Novel>;
}
