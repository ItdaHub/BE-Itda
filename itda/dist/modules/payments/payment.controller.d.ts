import { PaymentsService } from "./payment.service";
import { PaymentMethod, PaymentStatus } from "./payment.entity";
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createPayment(userId: number, amount: number, method: PaymentMethod): Promise<import("./payment.entity").Payment>;
    confirmTossPayment(body: {
        paymentKey: string;
        orderId: string;
        amount: number;
    }): Promise<{
        statusCode: number;
        message: string;
    }>;
    confirmPayment(paymentId: number, status: PaymentStatus): Promise<import("./payment.entity").Payment>;
    getPaymentById(paymentId: number): Promise<import("./payment.entity").Payment>;
    getPaymentsByUser(req: any): Promise<import("./payment.entity").Payment[]>;
}
