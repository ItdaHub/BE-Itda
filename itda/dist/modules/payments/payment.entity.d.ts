import { User } from "../users/user.entity";
export declare enum PaymentStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    REFUNDED = "refunded"
}
export declare enum PaymentMethod {
    TOSS = "toss",
    CARD = "card",
    PAYPAL = "paypal"
}
export declare class Payment {
    id: number;
    user: User;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    created_at: Date;
}
