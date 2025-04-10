import { ConfigService } from "@nestjs/config";
export declare class AiService {
    private readonly configService;
    private readonly Gemini_API;
    constructor(configService: ConfigService);
}
