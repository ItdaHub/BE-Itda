import { IsInt, IsPositive, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UsePopcornDto {
  @ApiProperty({
    description: "유저 ID",
    example: 1,
  })
  @IsInt({ message: "userId는 정수여야 합니다." })
  userId: number;

  @ApiProperty({
    description: "사용할 팝콘 개수",
    example: 10,
  })
  @IsInt({ message: "amount는 정수여야 합니다." })
  @IsPositive({ message: "amount는 0보다 커야 합니다." })
  amount: number;

  @ApiPropertyOptional({
    description: "사용 내역 설명",
    example: "챕터 열람",
  })
  @IsOptional()
  @IsString({ message: "description은 문자열이어야 합니다." })
  description?: string;

  @ApiPropertyOptional({
    description: "소설 ID (해당되는 경우)",
    example: 101,
  })
  @IsOptional()
  @IsInt()
  novelId?: number;

  @ApiPropertyOptional({
    description: "챕터 ID (해당되는 경우)",
    example: 5,
  })
  @IsOptional()
  @IsInt()
  chapterId?: number;
}
