import { IsEmail, IsString, MinLength, IsNotEmpty } from "class-validator";

export class AddUserDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password!: string;
}
export default AddUserDto;
