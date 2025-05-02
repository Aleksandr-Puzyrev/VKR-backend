import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { LessonsService } from "./lessons.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Lesson } from "./lessons.model";

@Controller("lessons")
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  create(@Body() dto: CreateLessonDto) {
    return this.lessonsService.create(dto);
  }

  @Get("/by-module/:moduleId")
  getByCourse(@Param("moduleId") moduleId: number) {
    return this.lessonsService.findByModule(+moduleId);
  }

  @ApiOperation({ summary: 'Получить урок в контексте курса и модуля' })
  @ApiResponse({ status: 200, type: Lesson })
  @Get(':lessonId/courses/:courseId/modules/:moduleId/')
  async getLesson(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('moduleId', ParseIntPipe) moduleId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number
  ) {
    return this.lessonsService.findLessonInCourse(courseId, moduleId, lessonId);
  }

  
}
