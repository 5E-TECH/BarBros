import { ApiProperty } from "@nestjs/swagger";
<<<<<<< HEAD
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateAdminDto{
      @ApiProperty({ example: 'Faxriddin Maripov' })
      @IsString()
      @IsOptional()
      full_name: string;
    
      @ApiProperty({ example: '+998940196141' })
      @IsString()
      @IsOptional()
      phone_number: string;
    
      @ApiProperty({ example: 'fazliddinomariipov@gmail.com' })
      @IsString()
      @IsOptional()
      @IsEmail()
      email: string;
    
=======
import { IsOptional, IsString, MinLength, MaxLength } from "class-validator";

export class UpdateAdminDto {
  @ApiProperty({ example: "New Name", required: false })
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiProperty({ example: "12345678", required: false })
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  password?: string;
>>>>>>> decbac9 (frony)
}