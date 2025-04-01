import { Repository } from "typeorm";
import { Payment } from "./payment.entity";
export declare class PaymentService {
    private readonly paymentRepository;
    constructor(paymentRepository: Repository<Payment>);
    create(paymentData: Partial<Payment>): Promise<Payment>;
    findOne(id: number): Promise<Payment>;
    findAll(): Promise<Payment[]>;
}
