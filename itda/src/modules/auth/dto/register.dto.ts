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

  type: LoginType = LoginType.LOCAL;
}
