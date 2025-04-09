import { IsOptional, IsEnum } from "class-validator";

export enum NovelType {
  FIRST = "first",
  RELAY = "relay",
}

export enum AgeGroup {
  Teens = 10,
  Twenties = 20,
  Thirties = 30,
  Forties = 40,
}

export class FilterNovelDto {
  @IsOptional()
  @IsEnum(NovelType)
  type?: NovelType;

  @IsOptional()
  genre?: string;

  @IsOptional()
  @IsEnum(AgeGroup)
  age?: AgeGroup;
}
