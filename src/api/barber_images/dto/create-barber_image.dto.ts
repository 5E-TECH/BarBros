import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class CreateBarberImageDto {
    @ApiProperty({example: "barber id"})
    @IsUUID()
    barber_id: string
}
