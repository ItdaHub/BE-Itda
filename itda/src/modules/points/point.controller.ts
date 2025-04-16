import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { PointService } from "./point.service";
import { PointType } from "./point.entity";

@Controller("popcorn")
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Get(":userId")
  async getUserPoints(@Param("userId", ParseIntPipe) userId: number) {
    const total = await this.pointService.getUserTotalPoints(userId);
    return { total };
  }

  @Get("charge/:userId")
  async getChargeHistory(@Param("userId", ParseIntPipe) userId: number) {
    return this.pointService.getUserHistory(userId, PointType.EARN);
  }

  @Get("use/:userId")
  async getUseHistory(@Param("userId", ParseIntPipe) userId: number) {
    return this.pointService.getUserHistory(userId, PointType.SPEND);
  }
}
