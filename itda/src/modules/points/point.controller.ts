import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { PointService } from "./point.service";

@Controller("popcorn")
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Get(":userId")
  async getUserPoints(@Param("userId", ParseIntPipe) userId: number) {
    const total = await this.pointService.getUserTotalPoints(userId);
    return { total };
  }
}
