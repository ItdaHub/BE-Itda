import { Repository } from "typeorm";
import { Payment } from "./payment.entity";
import { User } from "../users/user.entity";
export declare class PaymentService {
    private paymentRepository;
    private userRepository;
    constructor(paymentRepository: Repository<Payment>, userRepository: Repository<User>);
    preparePayment(data: any, user: User): Promise<{
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
