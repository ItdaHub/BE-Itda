import { IsEmail, IsString, IsOptional, IsEnum } from "class-validator";
import { LoginType, UserStatus, UserType } from "../user.entity"; // ✅ UserStatus 추가

export class CreateUserDto {
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

  @IsEnum(LoginType)
  type: LoginType;

  @IsOptional()
  @IsString()
  profile_img?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  age?: number;

  @IsOptional()
  @IsEnum(UserType)
  user_type?: UserType;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsString()
  birthYear?: string;
}
