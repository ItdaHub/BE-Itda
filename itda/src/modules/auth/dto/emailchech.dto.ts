import { IsEmail, IsNotEmpty } from "class-validator";

export class EmailCheckDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
