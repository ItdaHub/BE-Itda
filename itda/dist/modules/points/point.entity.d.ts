import { User } from "../users/user.entity";
export declare enum PointType {
    EARN = "earn",
    SPEND = "spend"
}
export declare class Point {
    id: number;
    user: User;
    amount: number;
    type: PointType;
    created_at: Date;
}
