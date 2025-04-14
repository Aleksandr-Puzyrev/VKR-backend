import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class FindQueryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;
}
