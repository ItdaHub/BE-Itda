import { IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ConfirmTossPaymentDto {
  @ApiProperty({
    example: "pay_3p7xU2R2kX4N2zLq9zPjF",
    description: "토스 결제 고유 키 (paymentKey)",
  })
  @IsString()
  paymentKey: string;

  @ApiProperty({
    example: "order_123456789",
    description: "상점에서 생성한 주문 ID",
  })
  @IsString()
  orderId: string;

  @ApiProperty({
    example: 10000,
    description: "결제 금액 (원화 단위)",
  })
  @IsNumber()
  amount: number;
}
