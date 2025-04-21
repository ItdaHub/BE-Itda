import {
  Post,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { PointService } from "./point.service";
import { PointType } from "./point.entity";
import { UsePopcornDto } from "./dto/usepopcorn.dto";

@Controller("popcorn")
export class PointController {
  constructor(private readonly pointService: PointService) {}

  // ✅ 팝콘 사용
  @Post("use")
  async usePopcorn(@Body() usePopcornDto: UsePopcornDto) {
    return this.pointService.spendPoints(usePopcornDto);
  }

  // ✅ 사용자 총 팝콘 보유량 조회
  @Get(":userId")
  async getUserPoints(@Param("userId", ParseIntPipe) userId: number) {
    const total = await this.pointService.getUserTotalPoints(userId);
    return { total };
  }

  // ✅ 충전 내역 (적립)
  @Get("charge/:userId")
  async getChargeHistory(@Param("userId", ParseIntPipe) userId: number) {
    return this.pointService.getUserHistory(userId, PointType.EARN);
  }

  // ✅ 사용 내역
  @Get("use/:userId")
  async getUseHistory(@Param("userId", ParseIntPipe) userId: number) {
    return this.pointService.getUserHistory(userId, PointType.SPEND);
  }
}
