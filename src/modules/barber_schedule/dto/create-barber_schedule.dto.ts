import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsString, Min, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { DayOfWeek } from '../entities/barber_schedule.entity';

export class CreateBarberScheduleDto {
  @ApiProperty({
    example: 'monday',
    description: 'Ish boshlanish kuni',
    enum: DayOfWeek,
  })
  @IsEnum(DayOfWeek, { message: 'start_day faqat monday-sunday orasida bo\'lishi kerak' })
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  start_day: DayOfWeek;

  @ApiProperty({
    example: 'friday',
    description: 'Ish tugash kuni',
    enum: DayOfWeek,
  })
  @IsEnum(DayOfWeek, { message: 'end_day faqat monday-sunday orasida bo\'lishi kerak' })
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  end_day: DayOfWeek;

  @ApiProperty({ example: '09:00:00', description: 'Boshlanish vaqti (HH:MM:SS)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'start_time HH:MM:SS formatida bo\'lishi kerak (masalan: 09:00:00)',
  })
  start_time: string;

  @ApiProperty({ example: '17:00:00', description: 'Tugash vaqti (HH:MM:SS)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'end_time HH:MM:SS formatida bo\'lishi kerak (masalan: 17:00:00)',
  })
  end_time: string;

  @ApiProperty({
    example: 10,
    description: 'Dam olish vaqti (daqiqalarda)',
  })
  @IsInt()
  @Min(0, { message: 'break_time 0 dan kichik bo\'lmasligi kerak' })
  @IsNotEmpty()
  break_time: number;

  @ApiProperty({ example: 1, description: 'Barber ID' })
  @IsInt()
  @IsNotEmpty()
  barber_id: number;
}
