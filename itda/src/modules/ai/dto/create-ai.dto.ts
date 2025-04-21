import { IsString, IsOptional } from "class-validator";

export class CreateAiDto {
  @IsString()
  prompt: string;

  @IsString()
  @IsOptional()
  genre?: string;
}
