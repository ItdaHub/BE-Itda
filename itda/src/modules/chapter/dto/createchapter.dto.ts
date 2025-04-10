import { IsString, MinLength } from "class-validator";

export class CreateChapterDto {
  @IsString()
  @MinLength(10, { message: "내용은 최소 10자 이상이어야 합니다." })
  content: string;
}
