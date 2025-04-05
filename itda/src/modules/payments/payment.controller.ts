import { Controller, Post, Body, Req, UseGuards } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { JwtAuthGuard } from "../auth/jwtauth.guard";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from "@nestjs/swagger";

// 💰 결제 관련 API 컨트롤러
@ApiTags("Payments")
@Controller("payments")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // ✅ 결제 준비 (프론트에서 호출, 결제 정보 생성)
  @UseGuards(JwtAuthGuard)
  @Post("prepare")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "결제 준비",
    description: "결제를 위한 주문 정보를 생성합니다. JWT 인증이 필요합니다.",
  })
  @ApiResponse({ status: 201, description: "결제 정보 준비 완료" })
  preparePayment(@Body() paymentData: any, @Req() req: any) {
    return this.paymentService.preparePayment(paymentData, req.user);
  }

  // ✅ 결제 성공 콜백 처리 (Toss에서 호출)
  @Post("success")
  @ApiOperation({
    summary: "결제 성공 처리",
    description:
      "Toss 결제 성공 시 호출되는 콜백 API입니다. 결제 상태를 '성공'으로 기록합니다.",
  })
  @ApiResponse({ status: 200, description: "결제 성공 처리 완료" })
  handleSuccess(@Body() data: any) {
    return this.paymentService.handleSuccess(data);
  }

  // ✅ 결제 실패 콜백 처리 (Toss에서 호출)
  @Post("fail")
  @ApiOperation({
    summary: "결제 실패 처리",
    description:
      "Toss 결제 실패 시 호출되는 콜백 API입니다. 결제 상태를 '실패'로 기록합니다.",
  })
  @ApiResponse({ status: 200, description: "결제 실패 처리 완료" })
  handleFail(@Body() data: any) {
    return this.paymentService.handleFail(data);
  }
}
