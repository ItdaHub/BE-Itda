import { Controller, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { ReportService } from "./report.service";
import { Report } from "./report.entity";

@Controller("reports")
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  // 모든 신고 목록 조회
  @Get()
  async findAll(): Promise<Report[]> {
    return this.reportService.findAll();
  }

  // 특정 신고 조회
  @Get(":id")
  async findOne(@Param("id") id: number): Promise<Report> {
    return this.reportService.findOne(id);
  }

  // 신고 생성
  @Post()
  async create(@Body() report: Report): Promise<Report> {
    return this.reportService.create(report);
  }

  // 신고 삭제
  @Delete(":id")
  async remove(@Param("id") id: number): Promise<void> {
    return this.reportService.remove(id);
  }
}
