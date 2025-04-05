import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
  @IsInt()
  userId: number;

  @IsInt()
  novelId: number;

  @IsOptional()
  @IsInt()
  chapterId?: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
