import { IsString, IsOptional } from "class-validator";

export class CreateAiDto {
  @IsString()
  prompt: string; // AI가 사용할 프롬프트 (소설 주제)

  @IsString()
  @IsOptional()
  genre?: string; // 사용자가 선택한 장르 (선택사항)
}
