import { Repository } from "typeorm";
import { Point, PointType } from "./point.entity";
import { User } from "../users/user.entity";
export declare class PointService {
    private pointRepository;
    constructor(pointRepository: Repository<Point>);
    getUserTotalPoints(userId: number): Promise<number>;
    addPoint(user: User, amount: number, type: PointType, description?: string): Promise<Point>;
    getUserHistory(userId: number, type: PointType): Promise<{
        title?: string;
        amount: number;
        date: string;
    }[]>;
}
