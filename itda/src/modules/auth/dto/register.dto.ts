import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsInt,
  Min,
  Max,
} from "class-validator";
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

  @IsOptional()
  @IsInt()
  @Min(10)
  @Max(40)
  age_group?: number;
}
