import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { Payment } from "./payment.entity";

@Controller("payments")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(@Body() paymentData: Partial<Payment>): Promise<Payment> {
    return this.paymentService.create(paymentData);
  }

  @Get(":id")
  async getPayment(@Param("id") id: number): Promise<Payment> {
    return this.paymentService.findOne(id);
  }

  @Get()
  async getAllPayments(): Promise<Payment[]> {
    return this.paymentService.findAll();
  }
}
