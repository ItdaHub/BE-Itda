import { PointService } from "../points/point.service";
export declare class PointController {
    private readonly pointService;
    constructor(pointService: PointService);
    getUserPoints(userId: number): Promise<{
        total: number;
    }>;
}
