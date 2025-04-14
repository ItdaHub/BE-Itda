import { Repository } from "typeorm";
import { Payment, PaymentStatus, PaymentMethod } from "./payment.entity";
import { User } from "../users/user.entity";
export declare class PaymentsService {
    private readonly paymentRepo;
    private readonly userRepo;
    constructor(paymentRepo: Repository<Payment>, userRepo: Repository<User>);
    createPayment(userId: number, amount: number, method: PaymentMethod): Promise<Payment>;
    confirmTossPayment(data: {
        paymentKey: string;
        orderId: string;
        amount: number;
    }): Promise<Payment>;
    confirmPayment(paymentId: number, status: PaymentStatus): Promise<Payment>;
    getPaymentById(paymentId: number): Promise<Payment>;
    getPaymentsByUser(userId: number): Promise<Payment[]>;
}
