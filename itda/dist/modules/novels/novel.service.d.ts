import { Repository } from "typeorm";
import { Novel } from "./novel.entity";
export declare class NovelService {
    private readonly novelRepository;
    constructor(novelRepository: Repository<Novel>);
    getAllNovels(): Promise<Novel[]>;
    getNovelById(id: number): Promise<Novel>;
    create(novelData: Partial<Novel>): Promise<Novel>;
    remove(id: number): Promise<void>;
}
