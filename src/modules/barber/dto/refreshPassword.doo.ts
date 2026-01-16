// src/api/barber/dto/RefreshPassword.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class BarberRefreshPasswordDto {
  @ApiProperty({ example: "barber@example.com" })
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: "newPassword123" })
  @IsString()
  @IsNotEmpty()
  new_password: string;
}
