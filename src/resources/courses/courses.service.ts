import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { CourseModule } from "src/modules/modules.model";
import { Lesson } from "src/resources/lessons/lessons.model";
import { Question } from "src/resources/questions/questions.model";
import { FindWithPaginationQueryDto } from "src/resources/users/dto/find-with-pagination-query.dto";
import { CourseStatuses } from "src/shared/constants/course-statuses";
import { Course } from "./courses.model";
import { CreateStructureCourseDto, ModulesDto } from "./dto/create-structure-course.dto";

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course) private courseRepository: typeof Course,
    @InjectModel(CourseModule) private moduleRepository: typeof CourseModule,
    @InjectModel(Lesson) private lessonRepository: typeof Lesson
  ) {}

  async createCourse(dto: CreateStructureCourseDto, userId: number) {
    try {
      const course = await this.courseRepository.create({
        title: dto.title,
        description: dto.description,
        audience: dto.audience,
        duration: dto.duration,
        goals: dto.goals,
        userId: userId,
        status: CourseStatuses.CREATED,
      });

      for (const moduleDto of dto.modules) {
        const courseModule = await this.moduleRepository.create({
          title: moduleDto.title,
          description: moduleDto.description,
          courseId: course.id,
        });

        if (moduleDto.lessons?.length) {
          for (const lessonDto of moduleDto.lessons) {
            await this.lessonRepository.create({
              title: lessonDto.title,
              content: lessonDto.content,
              moduleId: courseModule.id,
            });
          }
        }
      }

      return course;
    } catch (error) {
      throw new Error(`Ошибка при создании курса: ${error.message}`);
    }
  }

  async getAllCourses(findOptions: FindWithPaginationQueryDto) {
    try {
      const { search, page, limit } = findOptions;
      const offset = (page - 1) * limit;
      const { rows: courses, count } = await this.courseRepository.findAndCountAll({
        where: search
          ? {
              title: {
                [Op.iLike]: `%${search}%`,
              },
            }
          : undefined,
        include: { all: true },
        offset,
        limit,
        paranoid: true,
      });

      return {
        entities: courses,
        itemCount: count,
        page,
        limit,
      };
    } catch (error) {
      throw new Error(`Ошибка при получении курсов: ${error.message}`);
    }
  }

  async getCourseById(id: number) {
    try {
      return await this.courseRepository.findByPk(id, {
        include: [
          {
            model: CourseModule,
            include: [
              {
                model: Lesson,
                include: [Question],
              },
            ],
          },
        ],
      });
    } catch (error) {
      throw new Error(`Ошибка при получении курса с ID ${id}: ${error.message}`);
    }
  }

  async updateModule(id: number, dto: Partial<ModulesDto>) {
    try {
      const module = await this.moduleRepository.findByPk(id);
      if (!module) {
        throw new Error("Модуль не найден");
      }

      await module.update({
        title: dto.title,
        description: dto.description,
        lessons: dto.lessons,
      });

      return module;
    } catch (error) {
      throw new Error(`Ошибка при обновлении модуля: ${error.message}`);
    }
  }

  async updateLesson(moduleId: number, lessonId: number, dto: Partial<Lesson>) {
    try {
      const lesson = await this.lessonRepository.findOne({
        where: {
          id: lessonId,
          moduleId: moduleId,
        },
      });

      if (!lesson) {
        throw new Error("Урок не найден в указанном модуле");
      }

      await lesson.update(dto);

      if (dto.questions) {
        await Question.destroy({ where: { lessonId } });
        for (const questionDto of dto.questions) {
          await Question.create({
            ...questionDto,
            lessonId,
          });
        }
      }

      return lesson;
    } catch (error) {
      throw new Error(`Ошибка при обновлении урока: ${error.message}`);
    }
  }

  async updateCourseStatus(id: number, status: keyof typeof CourseStatuses): Promise<Course> {
    try {
      const course = await this.courseRepository.findOne({
        where: { id },
        rejectOnEmpty: true,
      });

      if (!CourseStatuses[status]) {
        throw new Error(`Недопустимый статус: ${status}`);
      }

      return await course.update({ status });
    } catch (error) {
      if (error.name === "SequelizeEmptyResultError") {
        throw new Error("Курс не найден");
      }
      throw new Error(`Ошибка при обновлении статуса: ${error.message}`);
    }
  }
}
