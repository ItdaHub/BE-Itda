import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { LoginType, UserType, UserStatus } from "../user.entity";

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  profile_img?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(LoginType)
  type?: LoginType;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  age?: number;

  @IsOptional()
  @IsEnum(UserType)
  user_type?: UserType;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
