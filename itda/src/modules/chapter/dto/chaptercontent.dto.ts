import { ApiProperty } from "@nestjs/swagger";

export class ChapterContentDto {
  @ApiProperty({ example: 1, description: "챕터 ID" })
  id: number;

  @ApiProperty({ example: 2, description: "챕터 번호" })
  chapterNumber: number;

  @ApiProperty({
    example: "주인공은 고요한 밤 속에서 조용히 걸어가고 있었다...",
    description: "챕터 본문",
  })
  content: string;

  @ApiProperty({
    example: "2024-04-16T12:00:00Z",
    description: "챕터 생성 날짜",
  })
  createdAt: Date;

  @ApiProperty({ example: "고요한 밤의 주인공", description: "소설 제목" })
  novelTitle: string;

  @ApiProperty({ example: 15, description: "이 챕터의 좋아요 수" })
  likesCount: number;
}
