import {
  IsEnum,
  IsIn,
  IsNumber,
  IsString,
  Length,
  MinLength,
} from "class-validator";

// export enum NovelType {
//   HOME = "home",
//   RELAY = "relay",
//   CONTEST = "contest",
// }

// export enum AgeGroup {
//   TEEN = "teen",
//   TWENTIES = "twenties",
//   THIRTIES = "thirties",
//   FORTIES = "forties",
// }

export class CreateNovelDto {
  @IsString()
  @Length(1, 10)
  title: string;

  @IsNumber()
  categoryId: number;

  @IsNumber()
  @IsIn([5, 7, 9])
  peopleNum: 5 | 7 | 9;

  @IsString()
  @MinLength(10)
  @Length(10, 300)
  content: string;

  // @IsEnum(NovelType)
  // type: NovelType;

  // @IsEnum(AgeGroup)
  // age_group: AgeGroup;

  userId: number;
}
