import {
  Controller,
  Post,
  Body,
  Param,
  BadRequestException,
  Req,
  UseGuards,
  ParseIntPipe,
  Get, // ✅ Get 데코레이터 import 확인
} from "@nestjs/common";
import { ReportService } from "./report.service";
import { Report, TargetType } from "./report.entity";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwtauth.guard";

@ApiTags("Reports")
@Controller("reports")
@UseGuards(JwtAuthGuard) // 기본적으로 JWT 인증 적용
@ApiBearerAuth()
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  // ✅ 댓글 신고 생성
  @Post("comments/:commentId")
  @ApiOperation({ summary: "댓글 신고 생성" })
  @ApiParam({
    name: "commentId",
    type: "number",
    description: "신고할 댓글 ID",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        reason: { type: "string", description: "신고 사유" },
      },
      required: ["reason"],
    },
  })
  @ApiResponse({ status: 201, description: "댓글 신고 완료" })
  @ApiResponse({ status: 400, description: "잘못된 요청" })
  @ApiResponse({ status: 404, description: "해당 댓글을 찾을 수 없음" })
  async reportComment(
    @Param("commentId", ParseIntPipe) commentId: number,
    @Body() reportData: { reason: string },
    @Req() req: any // 요청 객체에서 사용자 정보 추출
  ): Promise<Report> {
    if (!reportData.reason) {
      throw new BadRequestException("신고 사유를 입력해주세요.");
    }

    const report = new Report();
    report.reporter = req.user; // 현재 로그인한 사용자 ID 설정
    report.target_type = TargetType.COMMENT;
    report.target_id = commentId;
    report.reason = reportData.reason;
    return this.reportService.create(report);
  }

  // ✅ 소설 신고 생성
  @Post("novels/:novelId")
  @ApiOperation({ summary: "소설 신고 생성" })
  @ApiParam({ name: "novelId", type: "number", description: "신고할 소설 ID" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        reason: { type: "string", description: "신고 사유" },
      },
      required: ["reason"],
    },
  })
  @ApiResponse({ status: 201, description: "소설 신고 완료" })
  @ApiResponse({ status: 400, description: "잘못된 요청" })
  @ApiResponse({ status: 404, description: "해당 소설을 찾을 수 없음" })
  async reportNovel(
    @Param("novelId", ParseIntPipe) novelId: number,
    @Body() reportData: { reason: string },
    @Req() req: any // 요청 객체에서 사용자 정보 추출
  ): Promise<Report> {
    if (!reportData.reason) {
      throw new BadRequestException("신고 사유를 입력해주세요.");
    }

    const report = new Report();
    report.reporter = req.user; // 현재 로그인한 사용자 ID 설정
    report.target_type = TargetType.CHAPTER; // 소설 신고의 target_type을 CHAPTER로 가정
    report.target_id = novelId;
    report.reason = reportData.reason;
    return this.reportService.create(report);
  }

  // ✅ 모든 신고 목록 조회 (관리자 권한 필요)
  @Get()
  @ApiOperation({ summary: "모든 신고 목록 조회 (관리자)" })
  @ApiResponse({
    status: 200,
    description: "신고 목록 조회 성공",
    type: [Report],
  })
  async getAllReports(): Promise<Report[]> {
    return this.reportService.findAll();
  }

  // ✅ 특정 신고 ID로 신고 상세 정보 조회
  @Get(":reportId")
  @ApiOperation({ summary: "특정 신고 ID로 신고 상세 정보 조회" })
  @ApiParam({ name: "reportId", type: "number", description: "조회할 신고 ID" })
  @ApiResponse({
    status: 200,
    description: "신고 상세 정보 조회 성공",
    type: Report,
  })
  @ApiResponse({ status: 404, description: "해당 신고를 찾을 수 없음" })
  async getReportById(
    @Param("reportId", ParseIntPipe) reportId: number
  ): Promise<Report> {
    return this.reportService.findOne(reportId);
  }
}
