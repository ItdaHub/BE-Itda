import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateNovelDto {
  @IsInt()
  categoryId: number; // 장르 ID 숫자형

  @IsInt()
  peopleNum: number; // 참여 인원

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  title: string;

  @IsString()
  @MinLength(10)
  @MaxLength(300)
  content: string;

  @IsEnum(["new", "relay"], {
    message: "type은 'new' 또는 'relay'만 가능합니다.",
  })
  type: "new" | "relay";

  // @IsInt()
  // userId: number;
}
