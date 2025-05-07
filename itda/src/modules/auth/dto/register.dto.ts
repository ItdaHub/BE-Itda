import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsInt,
  Min,
  Max,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { LoginType } from "../../users/user.entity";

export class RegisterDto {
  @ApiProperty({
    example: "user@example.com",
    description: "사용자 이메일 (필수)",
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    example: "홍길동",
    description: "사용자 실명 (선택)",
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: "travelKing123",
    description: "닉네임 (필수)",
  })
  @IsString()
  nickname: string;

  @ApiPropertyOptional({
    example: "securePassword123!",
    description: "비밀번호 (소셜 로그인 시 생략 가능)",
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({
    example: "1990",
    description: "출생년도 (선택)",
  })
  @IsOptional()
  @IsString()
  birthYear?: string;

  @ApiPropertyOptional({
    example: "010-1234-5678",
    description: "휴대폰 번호 (선택)",
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    enum: LoginType,
    description: "회원가입 타입 (local, kakao, naver, google 등)",
    example: "local",
  })
  @IsEnum(LoginType)
  type: LoginType;

  @ApiPropertyOptional({
    example: 20,
    description: "연령대 그룹 (10~40 사이)",
    minimum: 10,
    maximum: 40,
  })
  @IsOptional()
  @IsInt()
  @Min(10)
  @Max(40)
  age_group?: number;
}
