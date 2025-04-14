import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // Создание вопроса
  @Post()
  create(@Body() dto: { questionText: string; options: string[]; answer: string; lessonId: number }) {
    return this.questionsService.create(dto);
  }

  // Получение вопросов для конкретного урока
  @Get('/by-lesson/:lessonId')
  getByLesson(@Param('lessonId') lessonId: number) {
    return this.questionsService.findByLesson(+lessonId);
  }
}
