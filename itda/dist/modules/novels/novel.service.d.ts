import { Repository } from "typeorm";
import { Novel } from "./novel.entity";
import { CreateNovelDto } from "./dto/createnovel.dto";
import { AddChapterDto } from "./dto/addchapter.dto";
import { Genre } from "../genre/genre.entity";
import { User } from "../users/user.entity";
import { Chapter } from "../chapter/chapter.entity";
import { Participant } from "./participant.entity";
export declare class NovelService {
    private readonly novelRepo;
    private readonly genreRepo;
    private readonly userRepo;
    private readonly chapterRepo;
    private readonly participantRepo;
    constructor(novelRepo: Repository<Novel>, genreRepo: Repository<Genre>, userRepo: Repository<User>, chapterRepo: Repository<Chapter>, participantRepo: Repository<Participant>);
    getAllNovels(): Promise<Novel[]>;
    getNovelById(id: number): Promise<Novel>;
    create(dto: CreateNovelDto): Promise<Novel>;
    addChapter(novelId: number, dto: AddChapterDto): Promise<Chapter>;
    private mapPeopleNum;
    getParticipants(novelId: number): Promise<Participant[]>;
    getFilteredNovels(type?: string, genre?: string, age?: string): Promise<Novel[]>;
    getNovelDetail(novelId: number, userId?: number): Promise<any>;
    findMyNovels(userId: number): Promise<Novel[]>;
    searchNovelsByTitle(query: string): Promise<Novel[]>;
}
