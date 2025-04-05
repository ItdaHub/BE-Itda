import { PaymentService } from "./payment.service";
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    preparePayment(paymentData: any, req: any): Promise<{
        message: string;
        orderId: number;
    }>;
    handleSuccess(data: any): Promise<{
        message: string;
    }>;
    handleFail(data: any): Promise<{
        message: string;
    }>;
}
