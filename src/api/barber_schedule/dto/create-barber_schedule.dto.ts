import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBarberScheduleDto {
  @ApiProperty({
    example: 'monday',
    description: 'Ish kuni (monday, tuesday...)',
  })
  @IsString()
  @IsNotEmpty()
  working_day: string;

  @ApiProperty({ example: '09:00:00', description: 'Boshlanish vaqti' })
  @IsString()
  @IsNotEmpty()
  start_time: string;

  @ApiProperty({ example: '17:00:00', description: 'Tugash vaqti' })
  @IsString()
  @IsNotEmpty()
  end_time: string;

  @ApiProperty({ example: 'uuid-barber-id', description: 'Barber ID (UUID)' })
  @IsString()
  @IsNotEmpty()
  barber_id: string;
}
