import { Repository } from "typeorm";
import { Payment, PaymentStatus, PaymentMethod } from "./entities/payment.entity";
import { User } from "../users/entities/user.entity";
import { PointService } from "../points/point.service";
export declare class PaymentsService {
    private readonly paymentRepository;
    private readonly userRepository;
    private readonly pointService;
    constructor(paymentRepository: Repository<Payment>, userRepository: Repository<User>, pointService: PointService);
    createPayment(userId: number, amount: number, method: PaymentMethod, orderId: string, type?: string, novelId?: number, chapterId?: number): Promise<Payment>;
    confirmTossPayment(data: {
        paymentKey: string;
        orderId: string;
        amount: number;
    }): Promise<Payment>;
    confirmPayment(paymentId: number, status: PaymentStatus): Promise<Payment>;
    getPaymentById(paymentId: number): Promise<Payment>;
    getPaymentsByUser(userId: number): Promise<Payment[]>;
}
