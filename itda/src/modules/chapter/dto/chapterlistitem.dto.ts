import { ApiProperty } from "@nestjs/swagger";

export class ChapterListItemDto {
  @ApiProperty({ example: 1, description: "챕터 ID" })
  id: number;

  @ApiProperty({ example: 1, description: "소설 ID" })
  novelId: number;

  @ApiProperty({ example: 2, description: "챕터 번호" })
  chapterNumber: number;

  @ApiProperty({
    example: "2024-04-16T12:00:00Z",
    description: "챕터 생성 날짜",
  })
  createdAt: Date;
}
