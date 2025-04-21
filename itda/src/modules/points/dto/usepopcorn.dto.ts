import { IsInt, IsPositive, IsOptional, IsString } from "class-validator";

export class UsePopcornDto {
  @IsInt({ message: "userId는 정수여야 합니다." })
  userId: number;

  @IsInt({ message: "amount는 정수여야 합니다." })
  @IsPositive({ message: "amount는 0보다 커야 합니다." })
  amount: number;

  @IsOptional()
  @IsString({ message: "description은 문자열이어야 합니다." })
  description?: string;

  @IsOptional()
  @IsInt()
  novelId?: number;

  @IsOptional()
  @IsInt()
  chapterId?: number;
}
