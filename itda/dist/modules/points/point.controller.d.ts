import { PointService } from "./point.service";
import { UsePopcornDto } from "./dto/usepopcorn.dto";
export declare class PointController {
    private readonly pointService;
    constructor(pointService: PointService);
    usePopcorn(usePopcornDto: UsePopcornDto): Promise<any>;
    getUserPoints(userId: number): Promise<{
        total: number;
    }>;
    getChargeHistory(userId: number): Promise<{
        title?: string;
        amount: number;
        date: string;
    }[]>;
    getUseHistory(userId: number): Promise<{
        title?: string;
        amount: number;
        date: string;
    }[]>;
    getPurchasedChapters(userId: number, novelId: number): Promise<import("./entities/purchases.entity").Purchase[]>;
}
