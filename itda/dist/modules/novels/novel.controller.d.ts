import { NovelService } from "./novel.service";
import { CreateNovelDto } from "./dto/createnovel.dto";
import { AddChapterDto } from "./dto/addchapter.dto";
import { Novel } from "./novel.entity";
export declare class NovelController {
    private readonly novelService;
    constructor(novelService: NovelService);
    getAllNovels(): Promise<Novel[]>;
    getNovelDetail(id: number, req: any): Promise<any>;
    createNovel(dto: CreateNovelDto, req: any): Promise<Novel>;
    addChapter(novelId: string, dto: AddChapterDto, req: any): Promise<import("../chapter/chapter.entity").Chapter>;
    getParticipants(novelId: string): Promise<import("./participant.entity").Participant[]>;
    getFilteredNovels(type: string, genre: string): Promise<Novel[]>;
    getMyNovels(req: any): Promise<Novel[]>;
    searchNovelsByTitle(query: string): Promise<Novel[]>;
}
