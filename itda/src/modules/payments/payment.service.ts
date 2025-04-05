import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Payment } from "./payment.entity";
import { User } from "../users/user.entity";

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,

    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async preparePayment(data: any, user: User) {
    const { amount, method } = data;

    const payment = this.paymentRepository.create({
      user,
      amount,
      method,
      status: "pending",
    });

    await this.paymentRepository.save(payment);
    return { message: "결제 준비 완료", orderId: payment.id };
  }

  async handleSuccess(data: any) {
    const { orderId } = data;

    const payment = await this.paymentRepository.findOne({
      where: { id: orderId },
    });

    if (!payment) throw new Error("결제 정보가 없습니다.");

    payment.status = "completed";
    await this.paymentRepository.save(payment);

    return { message: "결제 완료 처리됨" };
  }

  async handleFail(data: any) {
    const { orderId } = data;

    const payment = await this.paymentRepository.findOne({
      where: { id: orderId },
    });

    if (payment) {
      payment.status = "failed";
      await this.paymentRepository.save(payment);
    }

    return { message: "결제 실패 처리됨" };
  }
}
