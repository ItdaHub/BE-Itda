import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from "class-validator";
import { LoginType } from "../../users/user.entity"; // ✅ LoginType 임포트 필요

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string; // ✅ 필수

  @IsString()
  @IsNotEmpty()
  nickname: string; // ✅ 필수

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional() // ✅ 선택적으로 받을 수 있음
  type?: LoginType; // ✅ 필드 추가 (없으면 기본값 설정)
}
