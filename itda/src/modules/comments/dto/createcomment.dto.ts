import { IsInt, IsOptional, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
  @ApiProperty({ example: 1, description: "작성자(user) ID" })
  @IsInt()
  userId: number;

  @ApiProperty({ example: "재밌어요!", description: "댓글 내용" })
  @IsString()
  @MinLength(1)
  content: string;

  @ApiProperty({ example: 1, description: "소설 ID", required: false })
  @IsOptional()
  @IsInt()
  novelId?: number;

  @ApiProperty({ example: 5, description: "챕터 ID", required: false })
  @IsOptional()
  @IsInt()
  chapterId?: number;

  @ApiProperty({
    example: 3,
    description: "부모 댓글 ID (대댓글일 경우)",
    required: false,
  })
  @IsOptional()
  @IsInt()
  parentId?: number;
}
