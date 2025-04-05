import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class AddChapterDto {
  @IsInt()
  userId: number;

  @IsString()
  @IsNotEmpty({ message: "내용은 비워둘 수 없습니다." })
  content: string;
}
