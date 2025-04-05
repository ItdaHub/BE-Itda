import { Chapter } from "../chapter/chapter.entity";
import { Repository } from "typeorm";
export declare class WritersService {
    private readonly chapterRepo;
    constructor(chapterRepo: Repository<Chapter>);
    getNicknameByChapterId(chapterId: number): Promise<string>;
}
