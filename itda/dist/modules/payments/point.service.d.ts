import { Repository } from "typeorm";
import { Point } from "./point.entity";
import { User } from "../users/user.entity";
export declare class PointService {
    private pointRepository;
    constructor(pointRepository: Repository<Point>);
    getUserTotalPoints(userId: number): Promise<number>;
    addPoint(user: User, amount: number, type: "earn" | "spend"): Promise<Point>;
}
