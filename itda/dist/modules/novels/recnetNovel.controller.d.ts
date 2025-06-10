import { RecentNovelService } from "./recentNovel.service";
import { RecentNovelDto } from "./dto/recentNovel.dto";
export declare class RecentNovelController {
    private readonly recentNovelService;
    constructor(recentNovelService: RecentNovelService);
    addRecent(novelId: number, req: any): Promise<void>;
    getRecent(req: any): Promise<RecentNovelDto[]>;
}
