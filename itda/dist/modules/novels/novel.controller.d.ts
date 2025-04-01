import { NovelService } from "./novel.service";
import { Novel } from "./novel.entity";
export declare class NovelController {
    private readonly novelService;
    constructor(novelService: NovelService);
    getAllNovels(): Promise<Novel[]>;
    getNovelById(id: string): Promise<Novel>;
    create(novelData: Partial<Novel>): Promise<Novel>;
    remove(id: string): Promise<void>;
}
