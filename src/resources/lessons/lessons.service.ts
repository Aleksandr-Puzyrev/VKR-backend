import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Lesson } from "./lessons.model";
import { CreateLessonDto } from "./dto/create-lesson.dto";

@Injectable()
export class LessonsService {
  constructor(@InjectModel(Lesson) private lessonRepo: typeof Lesson) {}

  async create(dto: CreateLessonDto) {
    return this.lessonRepo.create(dto);
  }

  async findByModule(moduleId: number) {
    return this.lessonRepo.findAll({ where: { moduleId }, include: { all: true } });
  }
}
