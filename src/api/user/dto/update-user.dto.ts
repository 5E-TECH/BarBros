import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto {
<<<<<<< HEAD
     @ApiProperty({ example: 'Usmonqulov Abduhamid' })
=======
     @ApiProperty({ example: 'Faxriddin Maripov' })
>>>>>>> decbac9 (frony)
      @IsString()
      @IsNotEmpty()
      full_name: string;
    
      @ApiProperty({ example: '+998930451852' })
      @IsString()
      @IsNotEmpty()
      phone_number: string;
    
<<<<<<< HEAD
      @ApiProperty({ example: 'karalevstvabitva@gmail.com' })
      @IsString()
      @IsNotEmpty()
      @IsEmail()
      email: string;
=======
>>>>>>> decbac9 (frony)
    
}

