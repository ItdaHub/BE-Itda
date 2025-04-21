import { AiService } from "./ai.service";
import { NovelService } from "../novels/novel.service";
import { CreateAiDto } from "./dto/create-ai.dto";
export declare class AiController {
    private readonly aiService;
    private readonly novelService;
    constructor(aiService: AiService, novelService: NovelService);
    generateWithAI(body: CreateAiDto, req: any): Promise<{
        content: string;
        genre: string | undefined;
        userId: any;
    }>;
    summarize(content: string): Promise<string>;
    generateSummaryWithImageAndSave(body: {
        content: string;
        categoryId: number;
        peopleNum: 5 | 7 | 9;
        type: "new" | "relay";
    }, req: any): Promise<any>;
    saveUserWrittenNovelWithAiData(body: {
        content: string;
        categoryId: number;
        peopleNum: 5 | 7 | 9;
        type: "new" | "relay";
    }, req: any): Promise<any>;
}
