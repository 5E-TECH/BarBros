import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RefreshPasswordDto {
  @ApiProperty({ example: "shop@example.com" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "newPassword123" })
  @IsString()
  @IsNotEmpty()
  new_password: string;
}
