import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: "soch bo'yash" })
  @IsNotEmpty()
  @IsString()
  name: string;

}
