import { IsInt, IsString, MinLength, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateChapterDto {
  @ApiProperty({
    example: "주인공은 고요한 밤 속에서 조용히 걸어가고 있었다...",
    description: "챕터의 본문 내용입니다. 최소 10자 이상이어야 합니다.",
  })
  @IsString()
  @MinLength(10, { message: "내용은 최소 10자 이상이어야 합니다." })
  content: string;

  @ApiProperty({
    example: 3,
    description: "챕터 번호입니다. 이어쓰기일 때만 필요합니다.",
    required: false,
  })
  @IsInt()
  @IsOptional()
  chapterNumber?: number;
}
