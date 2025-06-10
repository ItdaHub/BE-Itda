import { NovelService } from "./novel.service";
import { RecentNovelService } from "./recentNovel.service";
import { CreateNovelDto } from "./dto/createnovel.dto";
import { AddChapterDto } from "./dto/addchapter.dto";
import { RecentNovelDto } from "./dto/recentNovel.dto";
import { Novel } from "./entities/novel.entity";
export declare class NovelController {
    private readonly novelService;
    private readonly recentNovelService;
    constructor(novelService: NovelService, recentNovelService: RecentNovelService);
    getAllNovels(): Promise<Novel[]>;
    getPublishedNovels(): Promise<Novel[]>;
    getFilteredNovels(type?: "new" | "relay", genre?: string, age?: number): Promise<any[]>;
    searchNovelsByTitle(query: string): Promise<Novel[]>;
    getRanking(age?: string): Promise<Novel[]>;
    getMyNovels(req: any): Promise<Novel[]>;
    createNovel(dto: CreateNovelDto, req: any): Promise<Novel>;
    getChapters(novelId: string): Promise<any[]>;
    addChapter(novelId: string, dto: AddChapterDto, req: any): Promise<any>;
    getParticipants(novelId: string): Promise<import("./entities/participant.entity").Participant[]>;
    getNovelDetail(id: number, req: any): Promise<any>;
    submitNovel(id: number): Promise<Novel>;
    addRecent(novelId: number, chapterNumber: number, req: any): Promise<void>;
    getRecent(req: any): Promise<RecentNovelDto[]>;
}
