import { User } from "src/modules/users/entities/user.entity";
import { Novel } from "./novel.entity";
export declare class Participant {
    id: number;
    novel: Novel;
    user: User;
    order_number: number;
    joined_at: Date;
}
