import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateChatDto {
  @ApiPropertyOptional({ example: 'Salom, bo‘sh vaqt bormi?' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ example: 12, description: 'User ID (barber uchun)' })
  @IsOptional()
  @IsInt()
  user_id?: number;

  @ApiPropertyOptional({ example: 5, description: 'Barber ID (user uchun)' })
  @IsOptional()
  @IsInt()
  barber_id?: number;
}
