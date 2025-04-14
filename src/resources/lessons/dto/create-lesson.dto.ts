import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateLessonDto {
  @ApiProperty({ example: 1, description: "Номер модуля курса" })
  @IsString({ message: "Должно быть числом" })
  readonly moduleId: number;
  @ApiProperty({ example: "Что такое HTML?", description: "Название урока" })
  @IsString({ message: "Должно быть строкой" })
  readonly title: string;
  @ApiProperty({
    example: "Определение, история, отличие от CSS и JS",
    description: "Краткое описание урока",
  })
  @IsString({ message: "Должно быть строкой" })
  readonly description: string;
}
