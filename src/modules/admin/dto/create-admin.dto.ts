import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateAdminDto {
  @ApiProperty({
    example: "Faxriddin Maripov",
    description: "Adminning to‘liq ismi"
  })
  @IsString()
  full_name: string;

  @ApiProperty({
    example: "admin@example.com",
    description: "Adminning email manzili"
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "+998901234567",
    description: "Admin telefon raqami"
  })
  @IsString()
  phone_number: string;

  @ApiProperty({
    example: "admin12345",
    description: "Adminning paroli (kamida 6ta belgi)"
  })
  @IsString()
  @MinLength(4)
  password: string;
}
