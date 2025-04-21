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
    orderId: string;
    amount: number;
    method: string;
    status: PaymentStatus;
    created_at: Date;
    novelId: number;
    chapterId: number;
    type: string;
}
