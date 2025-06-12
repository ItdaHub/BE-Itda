import {
  Post,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { PointService } from "./point.service";
import { PointType } from "./entities/point.entity";
import { UsePopcornDto } from "./dto/usepopcorn.dto";
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiResponse,
} from "@nestjs/swagger";

@ApiTags("Popcorn (Point)")
@Controller("popcorn")
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Post("use")
  @ApiOperation({
    summary: "팝콘 사용",
    description: "팝콘을 사용하여 회차를 구매합니다.",
  })
  @ApiBody({ type: UsePopcornDto })
  @ApiResponse({ status: 201, description: "팝콘 사용 성공" })
  async usePopcorn(@Body() usePopcornDto: UsePopcornDto) {
    console.log("🔥 [Controller] /points/use 요청 들어옴", usePopcornDto);
    return this.pointService.spendPoints(usePopcornDto);
  }

  @Get(":userId")
  @ApiOperation({
    summary: "사용자 팝콘 보유량 조회",
    description: "사용자의 총 팝콘 보유량을 조회합니다.",
  })
  @ApiParam({ name: "userId", type: Number, description: "사용자 ID" })
  @ApiResponse({ status: 200, description: "보유 팝콘 수 반환" })
  async getUserPoints(@Param("userId", ParseIntPipe) userId: number) {
    const total = await this.pointService.getUserTotalPoints(userId);
    return { total };
  }

  @Get("charge/:userId")
  @ApiOperation({
    summary: "팝콘 충전 내역",
    description: "사용자의 팝콘 충전 내역을 조회합니다.",
  })
  @ApiParam({ name: "userId", type: Number, description: "사용자 ID" })
  @ApiResponse({ status: 200, description: "충전 내역 반환" })
  async getChargeHistory(@Param("userId", ParseIntPipe) userId: number) {
    return this.pointService.getUserHistory(userId, PointType.EARN);
  }

  @Get("use/:userId")
  @ApiOperation({
    summary: "팝콘 사용 내역",
    description: "사용자의 팝콘 사용 내역을 조회합니다.",
  })
  @ApiParam({ name: "userId", type: Number, description: "사용자 ID" })
  @ApiResponse({ status: 200, description: "사용 내역 반환" })
  async getUseHistory(@Param("userId", ParseIntPipe) userId: number) {
    return this.pointService.getUserHistory(userId, PointType.SPEND);
  }

  @Get("purchases/:userId")
  @ApiOperation({
    summary: "구매한 회차 조회",
    description: "특정 소설에서 사용자가 구매한 회차 목록을 조회합니다.",
  })
  @ApiParam({ name: "userId", type: Number, description: "사용자 ID" })
  @ApiQuery({ name: "novelId", type: Number, description: "소설 ID" })
  @ApiResponse({ status: 200, description: "구매한 회차 목록 반환" })
  async getPurchasedChapters(
    @Param("userId", ParseIntPipe) userId: number,
    @Query("novelId", ParseIntPipe) novelId: number
  ) {
    return this.pointService.getPurchasedChapters(userId, novelId);
  }
}
