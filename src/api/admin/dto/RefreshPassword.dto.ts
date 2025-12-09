import { ApiProperty } from "@nestjs/swagger";
<<<<<<< HEAD
import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from "class-validator";

export class RefreshPasswortDto{
    @ApiProperty({example: "email"})
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({example: 123495, required: false})
    @IsOptional()
    otp?: number

    @ApiProperty({example: "12345678", required: false})
    @IsOptional()
    @MaxLength(20)
    @MinLength(4)
    new_password?: string
=======
import { IsEmail, IsOptional, IsString, MinLength, MaxLength } from "class-validator";

export class RefreshPasswordDto {
  @ApiProperty({ example: "admin@gmail.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "12345678", required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  new_password?: string;
>>>>>>> decbac9 (frony)
}