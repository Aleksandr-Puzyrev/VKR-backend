import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { Question } from './questions.model';
import { Lesson } from '../lessons/lessons.model';

@Module({
  imports: [SequelizeModule.forFeature([Question, Lesson])],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
