import { IsInt, IsString, MinLength, IsOptional } from "class-validator";

export class CreateChapterDto {
  @IsString()
  @MinLength(10, { message: "내용은 최소 10자 이상이어야 합니다." })
  content: string;

  @IsInt()
  @IsOptional() // 이어쓰기일 때만 필요하므로 Optional로 설정
  chapterNumber?: number; // 챕터 번호 추가
}
