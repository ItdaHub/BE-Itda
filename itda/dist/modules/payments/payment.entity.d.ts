import { User } from "../users/user.entity";
export declare class Payment {
    id: number;
    user: User;
    amount: number;
    method: string;
    status: string;
    created_at: Date;
}
