import { IntersectionType } from "@nestjs/swagger";
import { FindQueryDto } from "./find-query.dto";
import { PaginationQueryDto } from "./pagination-query.dto";

export class FindWithPaginationQueryDto extends IntersectionType(
  FindQueryDto,
  PaginationQueryDto
) {}
