import { IsOptional, IsEnum, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export enum NovelType {
  NEW = "new",
  RELAY = "relay",
}

export enum AgeGroup {
  Teens = 10,
  Twenties = 20,
  Thirties = 30,
  Forties = 40,
}

export class FilterNovelDto {
  @ApiPropertyOptional({
    enum: NovelType,
    example: NovelType.NEW,
    description: "소설 타입 (new: 새 소설, relay: 이어쓰기)",
  })
  @IsOptional()
  @IsEnum(NovelType)
  type?: NovelType;

  @ApiPropertyOptional({
    example: "로맨스",
    description: "장르명 (예: 로맨스, 스릴러, 무협 등)",
  })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiPropertyOptional({
    enum: AgeGroup,
    example: AgeGroup.Twenties,
    description: "추천 연령대 (10: 10대, 20: 20대, 30: 30대, 40: 40대)",
  })
  @IsOptional()
  @IsEnum(AgeGroup)
  age?: AgeGroup;
}
