import { Repository } from "typeorm";
import { Novel } from "./entities/novel.entity";
import { CreateNovelDto } from "./dto/createnovel.dto";
import { AddChapterDto } from "./dto/addchapter.dto";
import { Genre } from "../genre/entities/genre.entity";
import { User } from "../users/entities/user.entity";
import { Chapter } from "../chapter/entities/chapter.entity";
import { Participant } from "./entities/participant.entity";
import { NovelStatus } from "./entities/novel.entity";
import { NotificationService } from "../notifications/notification.service";
import { AiService } from "../ai/ai.service";
import { Tag } from "./entities/tag.entity";
type CreateNovelInput = CreateNovelDto & {
    userId: number;
};
export declare class NovelService {
    private readonly novelRepository;
    private readonly genreRepository;
    private readonly userRepository;
    private readonly chapterRepository;
    private readonly participantRepository;
    private readonly notificationService;
    private readonly tagRepository;
    private readonly aiService;
    constructor(novelRepository: Repository<Novel>, genreRepository: Repository<Genre>, userRepository: Repository<User>, chapterRepository: Repository<Chapter>, participantRepository: Repository<Participant>, notificationService: NotificationService, tagRepository: Repository<Tag>, aiService: AiService);
    getAllNovels(): Promise<Novel[]>;
    getPublishedNovels(): Promise<Novel[]>;
    getNovelById(id: number): Promise<any>;
    create(dto: CreateNovelInput): Promise<Novel>;
    addChapter(novelId: number, dto: AddChapterDto): Promise<any>;
    checkAndUpdateNovelStatus(novelId: number): Promise<void>;
    getChapters(novelId: number, userId?: number): Promise<any[]>;
    getParticipants(novelId: number): Promise<Participant[]>;
    getFilteredNovels(type?: string, genre?: string | number, age?: number): Promise<{
        id: number;
        title: string;
        genre: string;
        imageUrl: string;
        likes: number;
        views: number;
        created_at: Date;
    }[]>;
    getNovelDetail(novelId: number, userId?: number): Promise<any>;
    findMyNovels(userId: number): Promise<Novel[]>;
    searchNovelsByTitle(query: string): Promise<Novel[]>;
    getRankedNovels(): Promise<Novel[]>;
    getRankedNovelsByAge(ageGroup: number): Promise<Novel[]>;
    submitNovelForCompletion(novelId: number): Promise<Novel>;
    getCompletedNovels(): Promise<{
        id: number;
        title: string;
        writer: string;
        date: string;
        status: NovelStatus;
    }[]>;
    adminDeleteNovel(novelId: number): Promise<Novel>;
    adminPublishNovel(novelId: number): Promise<Novel>;
    getWaitingNovelsForSubmission(): Promise<{
        id: number;
        title: string;
        writer: string;
        date: string;
        status: NovelStatus;
    }[]>;
}
export {};
