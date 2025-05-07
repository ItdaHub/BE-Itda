import { IsEmail, IsString, IsOptional, IsEnum } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { LoginType, UserStatus, UserType } from "../user.entity";

export class CreateUserDto {
  @ApiProperty({
    description: "이메일 주소",
    example: "user@example.com",
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: "이름",
    example: "홍길동",
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: "닉네임",
    example: "cool_user",
  })
  @IsString()
  nickname: string;

  @ApiPropertyOptional({
    description: "비밀번호 (소셜 로그인 시 불필요)",
    example: "password123!",
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    description: "로그인 유형 (LOCAL | KAKAO | NAVER | GOOGLE)",
    enum: LoginType,
    example: LoginType.LOCAL,
  })
  @IsEnum(LoginType)
  type: LoginType;

  @ApiPropertyOptional({
    description: "프로필 이미지 URL",
    example: "https://example.com/profile.png",
  })
  @IsOptional()
  @IsString()
  profile_img?: string;

  @ApiPropertyOptional({
    description: "전화번호",
    example: "01012345678",
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: "나이",
    example: 25,
  })
  @IsOptional()
  age?: number;

  @ApiPropertyOptional({
    description: "유저 타입 (USER | ADMIN)",
    enum: UserType,
    example: UserType.USER,
  })
  @IsOptional()
  @IsEnum(UserType)
  user_type?: UserType;

  @ApiPropertyOptional({
    description: "유저 상태 (ACTIVE | INACTIVE | BANNED)",
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({
    description: "출생년도",
    example: "1998",
  })
  @IsOptional()
  @IsString()
  birthYear?: string;
}
