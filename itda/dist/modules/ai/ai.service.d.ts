import { ConfigService } from "@nestjs/config";
export declare class AiService {
    private readonly configService;
    private readonly apiUrl;
    constructor(configService: ConfigService);
    generateNovel(prompt: string): Promise<string>;
}
