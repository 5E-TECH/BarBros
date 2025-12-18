import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Category } from 'src/common/enum';

export class CreateCategoryDto {
  @ApiProperty({ example: "soch bo'yash" })
  @IsNotEmpty()
  @IsString()
  name: string;

 @ApiProperty({
    enum: Category,
    example: Category.MAN,
  })
  @IsNotEmpty()
  @IsEnum(Category)
  categoryType: Category;
}

