import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PaymentMethod } from "../payment.entity";

export class CreatePaymentDto {
  @ApiProperty({
    example: 1,
    description: "결제를 요청하는 사용자 ID",
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    example: 5000,
    description: "결제 금액 (원화 단위)",
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    enum: PaymentMethod,
    example: PaymentMethod.TOSS,
    description: "결제 수단 (예: TOSS, CARD 등)",
  })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  method: PaymentMethod;

  @ApiProperty({
    example: "order_abc123",
    description: "상점 또는 서버에서 생성한 고유 주문 ID",
  })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiPropertyOptional({
    example: "novel_charge",
    description: "결제 타입 (예: novel_charge, premium_unlock 등)",
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({
    example: 101,
    description: "관련된 소설 ID (선택)",
  })
  @IsNumber()
  @IsOptional()
  novelId?: number;

  @ApiPropertyOptional({
    example: 55,
    description: "관련된 회차(챕터) ID (선택)",
  })
  @IsNumber()
  @IsOptional()
  chapterId?: number;
}
