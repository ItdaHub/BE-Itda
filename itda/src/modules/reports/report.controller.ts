import { Controller, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { ReportService } from "./report.service";
import { Report } from "./report.entity";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

// 🚨 신고(Report) 관련 API 컨트롤러
@ApiTags("Reports")
@Controller("reports")
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  // ✅ 모든 신고 목록 조회
  @Get()
  @ApiOperation({
    summary: "신고 목록 조회",
    description: "등록된 모든 신고를 조회합니다.",
  })
  @ApiResponse({ status: 200, description: "신고 목록 반환" })
  async findAll(): Promise<Report[]> {
    return this.reportService.findAll();
  }

  // ✅ 특정 신고 조회
  @Get(":id")
  @ApiOperation({
    summary: "신고 상세 조회",
    description: "특정 ID의 신고 상세 정보를 반환합니다.",
  })
  @ApiResponse({ status: 200, description: "신고 상세 반환" })
  @ApiResponse({ status: 404, description: "해당 ID의 신고가 존재하지 않음" })
  async findOne(@Param("id") id: number): Promise<Report> {
    return this.reportService.findOne(id);
  }

  // ✅ 신고 생성
  @Post()
  @ApiOperation({
    summary: "신고 생성",
    description: "신고 정보를 생성합니다.",
  })
  @ApiResponse({ status: 201, description: "신고 생성 완료" })
  async create(@Body() report: Report): Promise<Report> {
    return this.reportService.create(report);
  }

  // ✅ 신고 삭제
  @Delete(":id")
  @ApiOperation({
    summary: "신고 삭제",
    description: "특정 ID의 신고를 삭제합니다.",
  })
  @ApiResponse({ status: 200, description: "신고 삭제 완료" })
  async remove(@Param("id") id: number): Promise<void> {
    return this.reportService.remove(id);
  }
}
