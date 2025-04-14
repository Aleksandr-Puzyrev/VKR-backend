import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Question } from "./questions.model";

@Injectable()
export class QuestionsService {
  constructor(@InjectModel(Question) private questionRepo: typeof Question) {}

  // Метод для создания вопросов с нужными полями
  async create(dto: { questionText: string; options: string[]; answer: string; lessonId: number }) {
    return this.questionRepo.create({
      questionText: dto.questionText,
      options: dto.options,
      answer: dto.answer,
      lessonId: dto.lessonId,
    });
  }

  async findByLesson(lessonId: number) {
    return this.questionRepo.findAll({ where: { lessonId } });
  }
}
