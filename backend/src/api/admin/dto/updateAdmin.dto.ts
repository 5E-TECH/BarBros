import { ApiProperty } from "@nestjs/swagger";
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
    
}