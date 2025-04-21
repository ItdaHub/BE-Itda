import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
} from "@nestjs/common";
import { PaymentsService } from "./payment.service";
import { JwtAuthGuard } from "../auth/jwtauth.guard";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { CreatePaymentDto } from "./dto/createpayment.dto";
import { ConfirmTossPaymentDto } from "./dto/confrimtosspayment.dto";
import { ManualConfirmPaymentDto } from "./dto/manualconfrimpayment.dto";
import { PaymentStatus } from "./payment.entity";

@ApiTags("Payments")
@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // 결제 요청
  @Post("create")
  @ApiOperation({
    summary: "결제 요청",
    description: "사용자가 결제를 요청합니다.",
  })
  @ApiResponse({ status: 201, description: "결제 요청 성공" })
  async createPayment(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.createPayment(
      dto.userId,
      dto.amount,
      dto.method,
      dto.orderId,
      dto.type,
      dto.novelId,
      dto.chapterId
    );
  }

  // ✅ Toss 리디렉션 정보로 결제 승인 처리
  @Post("confirm")
  @ApiOperation({
    summary: "Toss 결제 승인 요청",
    description:
      "Toss 결제 완료 후 paymentKey, orderId, amount로 결제 상태를 승인 처리합니다.",
  })
  @ApiResponse({ status: 200, description: "결제 승인 처리 완료" })
  async confirmTossPayment(@Body() dto: ConfirmTossPaymentDto) {
    const { paymentKey, orderId, amount } = dto;
    console.log("\uD83D\uDCE5 [결제 승인 요청 받음]", dto);
    try {
      const result = await this.paymentsService.confirmTossPayment({
        paymentKey,
        orderId,
        amount,
      });

      if (result.status === PaymentStatus.COMPLETED) {
        return { statusCode: 200, message: "결제 승인 처리 완료" };
      } else {
        return { statusCode: 400, message: "결제 승인 실패" };
      }
    } catch (error) {
      console.error("결제 승인 처리 중 오류:", error);
      return { statusCode: 500, message: "서버 오류 발생" };
    }
  }

  // 수동 결제 승인 (관리자 또는 수동 처리용)
  @Post("confirm/:id")
  @ApiOperation({
    summary: "결제 승인 (수동)",
    description: "결제 ID로 상태를 수동으로 승인 처리합니다.",
  })
  @ApiParam({ name: "id", type: Number, description: "결제 ID" })
  @ApiResponse({ status: 200, description: "결제 승인 성공" })
  async confirmPayment(
    @Param("id") paymentId: number,
    @Body() dto: ManualConfirmPaymentDto
  ) {
    return this.paymentsService.confirmPayment(paymentId, dto.status);
  }

  // 결제 ID로 단일 결제 내역 조회
  @Get(":id")
  @ApiOperation({
    summary: "결제 정보 조회",
    description: "결제 ID로 결제 정보를 조회합니다.",
  })
  @ApiParam({ name: "id", type: Number, description: "결제 ID" })
  @ApiResponse({ status: 200, description: "결제 정보 조회 성공" })
  async getPaymentById(@Param("id") paymentId: number) {
    return this.paymentsService.getPaymentById(paymentId);
  }

  // JWT 기반 사용자 결제 내역 조회
  @Get("my-payments")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "내 결제 내역 조회",
    description: "JWT 토큰을 기반으로 내가 한 결제 내역을 조회합니다.",
  })
  @ApiResponse({ status: 200, description: "내 결제 내역 조회 성공" })
  async getPaymentsByUser(@Req() req) {
    const userId = req.user.id;
    return this.paymentsService.getPaymentsByUser(userId);
  }
}
