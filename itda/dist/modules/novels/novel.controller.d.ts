import { NovelService } from "./novel.service";
import { CreateNovelDto } from "./dto/createnovel.dto";
import { AddChapterDto } from "./dto/addchapter.dto";
import { Novel } from "./novel.entity";
export declare class NovelController {
    private readonly novelService;
    constructor(novelService: NovelService);
    getAllNovels(): Promise<Novel[]>;
    getFilteredNovels(type?: "new" | "relay", genre?: string, req?: any): Promise<Novel[]>;
    createNovel(dto: CreateNovelDto, req: any): Promise<Novel>;
    addChapter(novelId: string, dto: AddChapterDto, req: any): Promise<import("../chapter/chapter.entity").Chapter>;
    getMyNovels(req: any): Promise<Novel[]>;
    searchNovelsByTitle(query: string): Promise<Novel[]>;
    getNovelDetail(id: number, req: any): Promise<any>;
    getParticipants(novelId: string): Promise<import("./participant.entity").Participant[]>;
    getTotalRanking(): Promise<Novel[]>;
    getRankingByAge(ageGroup: number): Promise<Novel[]>;
}
