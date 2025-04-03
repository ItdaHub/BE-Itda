import { IsString, IsOptional, IsEnum, IsEmail } from "class-validator";
import { LoginType } from "../../users/user.entity";

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  nickname: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  birthYear?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsEnum(LoginType)
  type: LoginType;
}
