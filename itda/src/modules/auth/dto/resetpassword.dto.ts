import { IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
  @IsString()
  token: string; // token만 받아오기

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(6)
  confirmPassword: string;
}
