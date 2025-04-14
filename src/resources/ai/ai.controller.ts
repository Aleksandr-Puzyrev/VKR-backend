import { CreateModuleCourseDto } from 'src/resources/ai/dto/create-module-course.dto';
import { Controller, Post, Body } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AiTask } from "./ai-task.model";
import { AiService } from "./ai.service";
import { CreateStructureCourseDto } from "../courses/dto/create-structure-course.dto";

@Controller("ai")
export class AiController {
  constructor(private aiService: AiService) {}

  @ApiOperation({ summary: "Генерация структуры курса по теме" })
  @ApiResponse({ status: 200, type: CreateStructureCourseDto })
  @Post('generate-structure')
  generateStructure(@Body() body: { query: string }) {
    return this.aiService.generateStructureCourse(body.query);
  }

  @ApiOperation({ summary: "Генерация урока" })
  @ApiResponse({ status: 200, type: CreateModuleCourseDto })
  @Post('generate-lesson')
  generateModule(@Body() body: { query: CreateModuleCourseDto }) {
    return this.aiService.generateLesson(body.query);
  }
}
