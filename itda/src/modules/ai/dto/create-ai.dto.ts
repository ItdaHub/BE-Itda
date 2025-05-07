import { IsString, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateAiDto {
  @ApiProperty({
    description: "AI가 생성할 프롬프트 문장",
    example: "여행을 주제로 한 짧은 소설을 생성해줘.",
  })
  @IsString()
  prompt: string;

  @ApiPropertyOptional({
    description: "선택적으로 지정할 장르 (예: 로맨스, 스릴러 등)",
    example: "로맨스",
  })
  @IsString()
  @IsOptional()
  genre?: string;
}
