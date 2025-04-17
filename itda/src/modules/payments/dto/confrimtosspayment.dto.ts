import { IsNumber, IsString } from "class-validator";

export class ConfirmTossPaymentDto {
  @IsString()
  paymentKey: string;

  @IsString()
  orderId: string;

  @IsNumber()
  amount: number;
}
