import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenDro{
    @ApiProperty({example: "Token"})
    @IsString()
    @IsNotEmpty()
    token: string
}