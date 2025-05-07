import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsEnum, IsOptional } from "class-validator";

export class SendNotificationDto {
  @ApiProperty({
    example: { id: 1, email: "user@example.com" },
    description: "알림을 받을 사용자 (요약 정보 또는 사용자 ID)",
  })
  user: any; // 실제 사용 시엔 userId만 받는 게 좋음

  @ApiProperty({
    example: "신고가 접수되었습니다.",
    description: "알림 내용",
  })
  @IsString()
  content: string;

  @ApiPropertyOptional({
    example: { id: 5, title: "신고된 소설 제목" },
    description: "관련 소설 정보 (선택)",
  })
  @IsOptional()
  novel?: any | null;

  @ApiPropertyOptional({
    example: { id: 10, reason: "욕설 포함" },
    description: "관련 신고 정보 (선택)",
  })
  @IsOptional()
  report?: any | null;

  @ApiPropertyOptional({
    enum: ["REPORT", "NOVEL_SUBMIT"],
    example: "REPORT",
    description: "알림 유형",
  })
  @IsOptional()
  @IsEnum(["REPORT", "NOVEL_SUBMIT"])
  type?: "REPORT" | "NOVEL_SUBMIT";
}
