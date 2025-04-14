import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { LessonsService } from "./lessons.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";

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
}
