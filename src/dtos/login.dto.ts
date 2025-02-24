import { IsEmail, IsString, MinLength, IsNotEmpty } from "class-validator";

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password!: string;
}
export default LoginDto;
