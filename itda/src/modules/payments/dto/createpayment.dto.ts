import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
} from "class-validator";
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

  @IsString()
  @IsOptional() // 선택적 입력
  type?: string;

  @IsNumber()
  @IsOptional()
  novelId?: number;

  @IsNumber()
  @IsOptional()
  chapterId?: number;
}
