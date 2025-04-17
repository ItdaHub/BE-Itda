import { PaymentMethod } from "../payment.entity";
export declare class CreatePaymentDto {
    userId: number;
    amount: number;
    method: PaymentMethod;
    orderId: string;
}
