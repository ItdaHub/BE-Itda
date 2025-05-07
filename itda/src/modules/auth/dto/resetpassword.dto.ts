import { IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
  @ApiProperty({
    example: "a1b2c3d4e5f6",
    description: "비밀번호 재설정을 위한 인증 토큰",
  })
  @IsString()
  token: string;

  @ApiProperty({
    example: "newStrongPass123!",
    description: "새 비밀번호 (최소 6자 이상)",
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: "newStrongPass123!",
    description: "새 비밀번호 확인 (password와 동일해야 함)",
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  confirmPassword: string;
}
