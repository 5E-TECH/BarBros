import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StarRating } from 'src/common/enum';

export class CreateReytingDto {
  @ApiProperty({
    example: 3
  })
  @IsEnum(StarRating)
  @IsNotEmpty()
  star: StarRating;

  @ApiProperty({
    example: 'Juda yaxshi xizmat!',
  })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  barber_id: number;
}
