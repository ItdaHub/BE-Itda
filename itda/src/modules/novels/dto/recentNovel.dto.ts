import { ApiProperty } from "@nestjs/swagger";
import { RecentNovel } from "../entities/recentNovel.entity";

export class RecentNovelDto {
  @ApiProperty({ example: 1, description: "최근 본 기록 ID" })
  id: number;

  @ApiProperty({ example: 101, description: "소설 ID" })
  novelId: number;

  @ApiProperty({ example: "달빛 아래의 속삭임", description: "소설 제목" })
  novelTitle: string;

  @ApiProperty({
    example: "https://example.com/thumbnail.jpg",
    description: "소설 썸네일 이미지 URL",
    required: false,
  })
  thumbnailUrl?: string;

  @ApiProperty({
    example: "2025-06-09T11:58:00.000Z",
    description: "최근 본 날짜/시간",
  })
  viewedAt: Date;

  constructor(recent: RecentNovel) {
    this.id = recent.id;
    this.novelId = recent.novel.id;
    this.novelTitle = recent.novel.title;
    this.thumbnailUrl = recent.novel.imageUrl;
    this.viewedAt = recent.viewedAt;
  }
}
