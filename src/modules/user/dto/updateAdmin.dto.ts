import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength, MaxLength } from "class-validator";

export class UpdateAdminDto {
  @ApiProperty({ example: "New Name", required: false })
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiProperty({ example: "12345678", required: false })
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  password?: string;
}