import { ApiProperty } from "@nestjs/swagger";

class AdminInfoDto {
  @ApiProperty({ example: 1, description: "관리자 ID" })
  id: number;

  @ApiProperty({ example: "admin@example.com", description: "관리자 이메일" })
  email: string;

  @ApiProperty({ example: "관리자닉네임", description: "관리자 닉네임" })
  nickname: string;
}

export class AnnouncementWithAdminDto {
  @ApiProperty({ example: 1, description: "공지사항 ID" })
  id: number;

  @ApiProperty({ example: "중요 공지", description: "공지 제목" })
  title: string;

  @ApiProperty({
    example: "시스템 점검이 예정되어 있습니다.",
    description: "공지 내용",
  })
  content: string;

  @ApiProperty({ enum: ["urgent", "normal"], description: "공지 우선순위" })
  priority: "urgent" | "normal";

  @ApiProperty({
    example: "2025-04-29T09:00:00.000Z",
    description: "공지 시작 날짜",
  })
  start_date: Date;

  @ApiProperty({
    example: "2025-04-28T12:00:00.000Z",
    description: "공지 생성 일시",
  })
  created_at: Date;

  @ApiProperty({
    example: "2025-04-28T15:30:00.000Z",
    description: "공지 수정 일시",
  })
  updated_at: Date;

  @ApiProperty({
    type: () => AdminInfoDto,
    description: "공지 작성자 관리자 정보",
  })
  admin: AdminInfoDto;

  @ApiProperty({ example: true, description: "해당 사용자가 읽었는지 여부" })
  isRead: boolean;
}
