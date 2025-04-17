// 관리자 수동 승인용
import { IsEnum } from "class-validator";
import { PaymentStatus } from "../payment.entity";

export class ManualConfirmPaymentDto {
  @IsEnum(PaymentStatus)
  status: PaymentStatus;
}
