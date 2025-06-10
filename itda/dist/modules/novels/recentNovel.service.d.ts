import { RecentNovel } from "./entities/recentNovel.entity";
import { Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { Novel } from "./entities/novel.entity";
export declare class RecentNovelService {
    private recentNovelRepo;
    private novelRepo;
    constructor(recentNovelRepo: Repository<RecentNovel>, novelRepo: Repository<Novel>);
    addRecentNovel(user: User, novelId: number): Promise<void>;
    getRecentNovels(user: User, limit?: number): Promise<RecentNovel[]>;
}
