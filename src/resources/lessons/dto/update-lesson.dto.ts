import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Question } from "src/resources/questions/questions.model";

export class UpdateLessonDto {
  @ApiProperty({ example: "Название урока", description: "Название урока" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: "Описание урока", description: "Описание урока" })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: "Содержание урока", description: "Содержание урока" })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ type: [Question], description: "Вопросы к уроку", required: false })
  @IsArray()
  @IsOptional()
  questions?: Question[];
}
