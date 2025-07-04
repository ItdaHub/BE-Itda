import { PaymentMethod } from "../entities/payment.entity";
export declare class CreatePaymentDto {
    userId: number;
    amount: number;
    method: PaymentMethod;
    orderId: string;
    type?: string;
    novelId?: number;
    chapterId?: number;
}
