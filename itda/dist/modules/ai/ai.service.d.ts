import { ConfigService } from "@nestjs/config";
import { NovelService } from "../novels/novel.service";
export declare class AiService {
    private readonly configService;
    private readonly novelService;
    private readonly apiUrl;
    constructor(configService: ConfigService, novelService: NovelService);
    generateText(prompt: string): Promise<string>;
    summarizeText(content: string): Promise<string>;
    private getImageFromUnsplash;
    createNovelWithAi(content: string, userId: number, categoryId: number, peopleNum: 5 | 7 | 9, type: "new" | "relay"): Promise<any>;
}
