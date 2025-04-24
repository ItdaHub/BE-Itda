import { Repository } from "typeorm";
import { Point, PointType } from "./point.entity";
import { User } from "../users/user.entity";
import { Purchase } from "./purchases.entity";
import { UsePopcornDto } from "./dto/usepopcorn.dto";
export declare class PointService {
    private pointRepository;
    private purchaseRepository;
    private userRepository;
    constructor(pointRepository: Repository<Point>, purchaseRepository: Repository<Purchase>, userRepository: Repository<User>);
    getUserTotalPoints(userId: number): Promise<number>;
    spendPoints(usePopcornDto: UsePopcornDto): Promise<any>;
    hasPurchased(userId: number, novelId: number, chapterId: number): Promise<boolean>;
    addPoint(user: User, amount: number, type: PointType, description?: string): Promise<Point>;
    getUserHistory(userId: number, type: PointType): Promise<{
        title?: string;
        amount: number;
        date: string;
    }[]>;
    getPurchasedChapters(userId: number, novelId: number): Promise<Purchase[]>;
}
