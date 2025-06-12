import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ArrayNotEmpty,
  ArrayMaxSize,
  ArrayUnique,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateNovelDto {
  @ApiProperty({
    example: 1,
    description: "카테고리(장르)의 ID (예: 로맨스=1, 스릴러=2 등)",
  })
  @IsInt()
  categoryId: number;

  @ApiProperty({
    example: 3,
    description: "참여할 작가 수",
  })
  @IsInt()
  peopleNum: number;

  @ApiProperty({
    example: "잃어버린 세계",
    description: "소설 제목 (최대 10자)",
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  title: string;

  @ApiProperty({
    example: "이 소설은 새로운 세계를 찾아 떠나는 여행자의 이야기입니다...",
    description: "소설 소개글 (10~1500자)",
    minLength: 10,
    maxLength: 1500,
  })
  @IsString()
  @MinLength(10)
  @MaxLength(1500)
  content: string;

  @ApiProperty({
    enum: ["new", "relay"],
    example: "new",
    description: "소설 유형: 'new' (새 소설 시작) 또는 'relay' (이어쓰기)",
  })
  @IsEnum(["new", "relay"], {
    message: "type은 'new' 또는 'relay'만 가능합니다.",
  })
  type: "new" | "relay";

  @ApiPropertyOptional({
    example: "https://example.com/image.jpg",
    description: "썸네일 이미지 URL (선택)",
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: ["판타지", "로맨스"],
    description: "소설에 달 태그 목록 (문자열 배열)",
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(5, { message: "태그는 최대 5개까지 입력할 수 있습니다." })
  @ArrayUnique()
  @IsString({ each: true })
  tags?: string[];
}
