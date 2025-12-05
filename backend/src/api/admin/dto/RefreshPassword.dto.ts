import { ApiProperty } from "@nestjs/swagger";
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
}