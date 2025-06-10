import { RecentNovel } from "../entities/recentNovel.entity";
export declare class RecentNovelDto {
    id: number;
    novelId: number;
    novelTitle: string;
    thumbnailUrl?: string;
    viewedAt: Date;
    constructor(recent: RecentNovel);
}
