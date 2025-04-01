import { PaymentService } from "./payment.service";
import { Payment } from "./payment.entity";
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createPayment(paymentData: Partial<Payment>): Promise<Payment>;
    getPayment(id: number): Promise<Payment>;
    getAllPayments(): Promise<Payment[]>;
}
