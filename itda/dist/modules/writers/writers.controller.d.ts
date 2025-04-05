import { WritersService } from "../writers/writers.service";
export declare class WritersController {
    private readonly writersService;
    constructor(writersService: WritersService);
    getWriterNickname(chapterId: number): Promise<{
        nickname: string;
    }>;
}
