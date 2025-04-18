import { NovelService } from "./novel.service";
import { CreateNovelDto } from "./dto/createnovel.dto";
import { AddChapterDto } from "./dto/addchapter.dto";
import { Novel } from "./novel.entity";
export declare class NovelController {
    private readonly novelService;
    constructor(novelService: NovelService);
    getAllNovels(): Promise<Novel[]>;
    getPublishedNovels(): Promise<Novel[]>;
    getFilteredNovels(type?: "new" | "relay", genre?: string, age?: number, req?: any): Promise<any[]>;
    searchNovelsByTitle(query: string): Promise<Novel[]>;
    getRanking(age?: string): Promise<Novel[]>;
    getMyNovels(req: any): Promise<Novel[]>;
    createNovel(dto: CreateNovelDto, req: any): Promise<Novel>;
    getChapters(novelId: string): Promise<any[]>;
    addChapter(novelId: string, dto: AddChapterDto, req: any): Promise<any>;
    getParticipants(novelId: string): Promise<import("./participant.entity").Participant[]>;
    getNovelDetail(id: number, req: any): Promise<any>;
    submitNovel(id: number): Promise<Novel>;
}
