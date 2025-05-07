import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class EmailCheckDto {
  @ApiProperty({
    example: "user@example.com",
    description: "중복 확인할 이메일 주소",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
