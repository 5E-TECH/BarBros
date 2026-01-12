import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubCategoryDto {
  @ApiProperty({ example: "soch bo'yash" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: "soch bo'yash eng zo'ri bizda" })
  @IsNotEmpty()
  @IsString()
  description: string;

  
}

