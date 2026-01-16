import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class BarberShopRefreshPasswordDto {
  @ApiProperty({ example: "bar bro " })
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: "newPassword123" })
  @IsString()
  @IsNotEmpty()
  new_password: string;
}
