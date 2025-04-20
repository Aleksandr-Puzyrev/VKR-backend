import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsIn } from "class-validator";
import { CourseStatuses } from "src/shared/constants/course-statuses";

export class UpdateCourseStatusDto {
  @ApiProperty({
    description: "Новый статус курса",
    enum: Object.keys(CourseStatuses),
    example: "PUBLISHED",
  })
  @IsString()
  @IsIn(Object.keys(CourseStatuses))
  status: keyof typeof CourseStatuses;
}
