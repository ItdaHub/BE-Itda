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
  @IsEnum(UserStatus) // ✅ 여기서 UserStatus 사용
  status?: UserStatus; // ✅ 선택적 필드로 변경

  @IsOptional()
  @IsString()
  birthYear?: string; // ✅ 네이버 로그인을 위해 추가
}
