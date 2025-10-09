import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from "class-validator";

export class RefreshPasswortDto{
    @ApiProperty({example: "email"})
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({example: 123495, required: false})
    @IsOptional()
    otp?: number

    @ApiProperty({example: "12345678", required: false})
    @IsOptional()
    @MaxLength(20)
    @MinLength(4)
    new_password?: string
}