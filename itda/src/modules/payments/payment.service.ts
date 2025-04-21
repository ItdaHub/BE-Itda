import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Payment, PaymentStatus, PaymentMethod } from "./payment.entity";
import { User } from "../users/user.entity";
import { PointService } from "../points/point.service";
import { PointType } from "../points/point.entity";
import { Point } from "../points/point.entity";
import axios from "axios";

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly pointService: PointService
  ) {}

  async createPayment(
    userId: number,
    amount: number,
    method: PaymentMethod,
    orderId: string,
    type?: string,
    novelId?: number,
    chapterId?: number
  ): Promise<Payment> {
    console.log("Received create payment request:", {
      userId,
      amount,
      method,
      orderId,
      type,
      novelId,
      chapterId,
    });

    const user = await this.userRepo.findOneByOrFail({ id: userId });
    console.log("User found:", user);

    // 사용자 보유 포인트 확인
    const userPoints = await this.pointService.getUserTotalPoints(userId);

    if (type === "read" && novelId && chapterId) {
      // 팝콘(포인트)가 부족하면 결제 처리
      if (userPoints < amount) {
        // 팝콘이 부족한 경우 결제 생성
        console.log("팝콘이 부족하여 결제 요청");

        const payment = this.paymentRepo.create({
          user,
          amount,
          method,
          status: PaymentStatus.PENDING,
          orderId,
          type,
          novelId,
          chapterId,
        });

        const savedPayment = await this.paymentRepo.save(payment);

        console.log("결제 생성 완료:", savedPayment);

        // 결제 요청 후 리턴
        return savedPayment;
      } else {
        // 팝콘이 충분하면 포인트 차감
        await this.pointService.spendPoints({
          userId,
          novelId,
          chapterId,
          amount,
        });

        console.log("포인트 차감 완료.");
      }
    }

    const payment = this.paymentRepo.create({
      user,
      amount,
      method,
      status: PaymentStatus.PENDING,
      orderId,
      type,
      novelId,
      chapterId,
    });

    const savedPayment = await this.paymentRepo.save(payment);

    console.log("Payment saved:", savedPayment);

    return savedPayment;
  }

  async confirmTossPayment(data: {
    paymentKey: string;
    orderId: string;
    amount: number;
  }): Promise<Payment> {
    const { paymentKey, orderId, amount } = data;

    if (!paymentKey || !orderId || isNaN(amount) || amount <= 0) {
      throw new HttpException(
        "결제 정보가 올바르지 않습니다.",
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      const response = await axios.post(
        `https://api.tosspayments.com/v1/payments/confirm`,
        { paymentKey, orderId, amount },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${process.env.TOSS_SECRET_KEY}:`).toString("base64")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Toss API 응답:", response.data);
      const tossPaymentData = response.data;

      if (!tossPaymentData || tossPaymentData.status !== "DONE") {
        throw new HttpException(
          "Toss 결제 승인에 실패했습니다.",
          HttpStatus.BAD_REQUEST
        );
      }

      let payment = await this.paymentRepo.findOne({
        where: { orderId },
        relations: ["user"],
      });

      if (!payment) {
        throw new HttpException(
          `결제 정보가 존재하지 않습니다. orderId: ${orderId}`,
          HttpStatus.NOT_FOUND
        );
      }

      if (payment.status === PaymentStatus.COMPLETED) {
        return payment;
      }

      payment.status = PaymentStatus.COMPLETED;
      payment.method = tossPaymentData.method;
      payment.amount = tossPaymentData.totalAmount;

      const savedPayment = await this.paymentRepo.save(payment);

      // ✅ 포인트 적립
      await this.pointService.addPoint(
        savedPayment.user,
        savedPayment.amount,
        PointType.EARN
      );

      return savedPayment;
    } catch (error) {
      const errorCode = error.response?.data?.code;
      console.error(
        "Toss 결제 승인 오류:",
        error.response?.data || error.message
      );

      if (errorCode === "FAILED_PAYMENT_INTERNAL_SYSTEM_PROCESSING") {
        throw new HttpException(
          "Toss 결제 시스템이 일시적으로 처리 중입니다. 잠시 후 다시 시도해주세요.",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      if (errorCode === "ALREADY_PROCESSED_PAYMENT") {
        const existingPayment = await this.paymentRepo.findOne({
          where: { orderId },
          relations: ["user"],
        });

        if (existingPayment?.status === PaymentStatus.COMPLETED) {
          return existingPayment;
        }

        throw new HttpException("이미 처리된 결제입니다.", HttpStatus.CONFLICT);
      }

      throw new HttpException(
        "결제 승인에 실패했습니다.",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async confirmPayment(
    paymentId: number,
    status: PaymentStatus
  ): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error("결제 정보를 찾을 수 없습니다.");
    }

    if (payment.status !== PaymentStatus.PENDING) {
      throw new Error("이미 결제가 처리되었습니다.");
    }

    payment.status = status;
    return await this.paymentRepo.save(payment);
  }

  async getPaymentById(paymentId: number): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({
      where: { id: paymentId },
      relations: ["user"],
    });

    if (!payment) {
      throw new Error("결제 정보를 찾을 수 없습니다.");
    }

    return payment;
  }

  async getPaymentsByUser(userId: number): Promise<Payment[]> {
    return await this.paymentRepo.find({
      where: { user: { id: userId } },
      order: { created_at: "DESC" },
    });
  }
}
