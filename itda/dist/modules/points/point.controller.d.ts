import { PointService } from "./point.service";
export declare class PointController {
    private readonly pointService;
    constructor(pointService: PointService);
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
}
