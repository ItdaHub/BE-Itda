import { PaymentsService } from "./payment.service";
import { CreatePaymentDto } from "./dto/createpayment.dto";
import { ConfirmTossPaymentDto } from "./dto/confrimtosspayment.dto";
import { ManualConfirmPaymentDto } from "./dto/manualconfrimpayment.dto";
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createPayment(dto: CreatePaymentDto): Promise<import("./entities/payment.entity").Payment>;
    confirmTossPayment(dto: ConfirmTossPaymentDto): Promise<{
        statusCode: number;
        message: string;
    }>;
    confirmPayment(paymentId: number, dto: ManualConfirmPaymentDto): Promise<import("./entities/payment.entity").Payment>;
    getPaymentById(paymentId: number): Promise<import("./entities/payment.entity").Payment>;
    getPaymentsByUser(req: any): Promise<import("./entities/payment.entity").Payment[]>;
}
