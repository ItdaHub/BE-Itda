import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { LoginType, UserType, UserStatus } from "../entities/user.entity";

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: "변경할 이메일 주소",
    example: "newuser@example.com",
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: "새 비밀번호",
    example: "newPassword123!",
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({
    description: "새 프로필 이미지 URL",
    example: "https://example.com/new-profile.png",
  })
  @IsOptional()
  @IsString()
  profile_img?: string;

  @ApiPropertyOptional({
    description: "전화번호",
    example: "01098765432",
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: "로그인 유형 (LOCAL | KAKAO | NAVER | GOOGLE)",
    enum: LoginType,
    example: LoginType.LOCAL,
  })
  @IsOptional()
  @IsEnum(LoginType)
  type?: LoginType;

  @ApiPropertyOptional({
    description: "이름",
    example: "김철수",
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: "닉네임",
    example: "updated_nickname",
  })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({
    description: "나이",
    example: 30,
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
}
