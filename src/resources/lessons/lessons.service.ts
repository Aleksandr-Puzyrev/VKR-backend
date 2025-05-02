import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Lesson } from "./lessons.model";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { Course } from "../courses/courses.model";
import { CourseModule } from "src/modules/modules.model";

@Injectable()
export class LessonsService {
  constructor(
    @InjectModel(Lesson) private lessonRepo: typeof Lesson,
    @InjectModel(CourseModule) private moduleRepo: typeof CourseModule,
    @InjectModel(Course) private courseRepo: typeof Course
  ) {}

  async create(dto: CreateLessonDto) {
    return this.lessonRepo.create(dto);
  }

  async findByModule(moduleId: number) {
    return this.lessonRepo.findAll({ where: { moduleId }, include: { all: true } });
  }

  async findLessonInCourse(courseId: number, moduleId: number, lessonId: number) {
    // Проверяем существование курса
    const course = await this.courseRepo.findByPk(courseId);
    if (!course) {
      throw new NotFoundException(`Курс с ID ${courseId} не найден`);
    }

    // Проверяем, что модуль принадлежит курсу
    const module = await this.moduleRepo.findOne({
      where: { id: moduleId, courseId },
    });
    if (!module) {
      throw new NotFoundException(`Модуль с ID ${moduleId} не найден в курсе ${courseId}`);
    }
    const lesson = await this.lessonRepo.findOne({
      where: { id: lessonId, moduleId },
      include: [
        {
          model: CourseModule,
          include: [Course],
        },
        { all: true }, // Включаем все ассоциации урока
      ],
    });

    if (!lesson) {
      throw new NotFoundException(`Урок с ID ${lessonId} не найден в модуле ${moduleId}`);
    }

    return lesson;
  }

  async findOne(id: number): Promise<Lesson> {
    const lesson = await this.lessonRepo.findByPk(id);
    
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
    
    return lesson;
  }
}
