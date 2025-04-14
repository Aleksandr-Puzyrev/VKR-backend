import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive } from "class-validator";
import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_MAX_LIMIT } from "src/shared/constants";

export class PaginationQueryDto {
  @ApiPropertyOptional({ default: DEFAULT_PAGE })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  page: number = DEFAULT_PAGE;

  @ApiPropertyOptional({
    default: DEFAULT_PAGE_LIMIT,
    maximum: DEFAULT_PAGE_MAX_LIMIT,
  })
  @Type(() => Number)
  @Transform(
    ({ value }) => {
      if (value) {
        if (value > DEFAULT_PAGE_MAX_LIMIT) {
          return DEFAULT_PAGE_MAX_LIMIT;
        } else {
          return value;
        }
      } else {
        return DEFAULT_PAGE_LIMIT;
      }
    },
    {
      toClassOnly: true,
    }
  )
  @IsInt()
  @IsPositive()
  @IsOptional()
  limit: number = DEFAULT_PAGE_LIMIT;
}
