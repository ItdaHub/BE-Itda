import { Repository } from "typeorm";
import { Point, PointType } from "./point.entity";
import { User } from "../users/user.entity";
export declare class PointService {
    private pointRepository;
    private userRepository;
    constructor(pointRepository: Repository<Point>, userRepository: Repository<User>);
    getUserTotalPoints(userId: number): Promise<number>;
    spendPoints(dto: {
        userId: number;
        amount: number;
        description?: string;
        novelId?: number;
        chapterId?: number;
    }): Promise<Point>;
    addPoint(user: User, amount: number, type: PointType, description?: string): Promise<Point>;
    getUserHistory(userId: number, type: PointType): Promise<{
        title?: string;
        amount: number;
        date: string;
    }[]>;
}
