import { IsEmail, IsString, IsOptional } from "class-validator";
import { LoginType } from "../../users/user.entity";

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password: string | null;

  @IsString()
  nickname: string;

  @IsOptional()
  @IsString()
  birthDate?: string;

  // `local` 회원가입 기본값 추가
  type: LoginType = LoginType.LOCAL;
}
