import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { PaymentMethod } from "../payment.entity";

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  method: PaymentMethod;

  @IsString()
  @IsNotEmpty()
  orderId: string;
}
