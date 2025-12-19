import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateBarberScheduleDto {
  @ApiProperty({
    example: 'monday',
    description: 'Ish boshlanish  kuni (monday, tuesday...)',
  })
  @IsString()
  @IsNotEmpty()
  start_day: string;

  @ApiProperty({
    example: 'monday',
    description: 'Ish tugash  kuni (monday, tuesday...)',
  })
  @IsString()
  @IsNotEmpty()
  end_day: string;

  @ApiProperty({ example: '09:00:00', description: 'Boshlanish vaqti' })
  @IsString()
  @IsNotEmpty()
  start_time: string;

  @ApiProperty({ example: '17:00:00', description: 'Tugash vaqti' })
  @IsString()
  @IsNotEmpty()
  end_time: string;

  @ApiProperty({
    example: '10 minutda',
    description: "har bir ish oralig'ida dam olish vaqti",
  })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  break_time: number;

  @ApiProperty({ example: '1,2,3,....', description: 'Barber ID (int)' })
  @IsNotEmpty()
  barber_id: number;
}
