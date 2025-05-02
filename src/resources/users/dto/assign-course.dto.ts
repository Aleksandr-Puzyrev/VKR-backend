import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class AssignCourseDto {
  @ApiProperty({ example: 1, description: "ID пользователя" })
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 1, description: "ID курса" })
  @IsNumber()
  courseId: number;
}