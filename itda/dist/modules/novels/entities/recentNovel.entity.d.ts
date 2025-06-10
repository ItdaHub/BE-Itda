import { User } from "src/modules/users/entities/user.entity";
import { Novel } from "src/modules/novels/entities/novel.entity";
export declare class RecentNovel {
    id: number;
    user: User;
    novel: Novel;
    chapterNumber: number;
    viewedAt: Date;
}
