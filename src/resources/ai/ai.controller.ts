import { Body, Controller, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateStructureCourseDto } from "../courses/dto/create-structure-course.dto";
import { Lesson } from "../lessons/lessons.model";
import { AiService } from "./ai.service";
import { AssistantRequestDto } from "./dto/assistant.dto";
import { CreateModuleCourseDto } from "./dto/create-module-course.dto";

@Controller("ai")
export class AiController {
  constructor(private aiService: AiService) {}

  @ApiOperation({ summary: "Генерация структуры курса по теме" })
  @ApiResponse({ status: 200, type: CreateStructureCourseDto })
  @Post("generate-structure")
  generateStructure(@Body() body: { topic: string }) {
    return this.aiService.generateStructureCourse(body.topic);
  }

  @ApiOperation({ summary: "Генерация урока" })
  @ApiResponse({ status: 200, type: Lesson })
  @Post("generate-lesson")
  generateLesson(
    @Body() body: { query: CreateModuleCourseDto; moduleId: number; lessonId: number }
  ) {
    return this.aiService.generateLesson(body.query, body.moduleId, body.lessonId);
  }

  @ApiOperation({ summary: "Запрос к ИИ-ассистенту урока" })
  @ApiResponse({ status: 200, type: AssistantRequestDto })
  @Post("assistant")
  handleAssistantQuery(@Body() body: AssistantRequestDto) {
    return this.aiService.handleAssistantQuery(body.lessonId, body.message);
  }
}
