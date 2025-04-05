import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  MinLength,
} from "class-validator";

export class CreateNovelDto {
  @IsString()
  @Length(1, 10)
  title: string;

  @IsEnum(["romance", "ropan", "fantasy", "hyenpan", "muhyeop"])
  category: string;

  @IsEnum(["five", "seven", "nine"])
  peopleNum: string;

  @IsString()
  @MinLength(10)
  @Length(10, 300)
  content: string;

  @IsEnum(["home", "relay", "contest"])
  type: "home" | "relay" | "contest";

  @IsEnum(["teen", "twenties", "thirties", "forties"])
  age_group: "teen" | "twenties" | "thirties" | "forties";

  userId: number;
}
