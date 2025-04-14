import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { CourseModule } from "src/modules/modules.model";
import { Lesson } from "src/resources/lessons/lessons.model";
import { Question } from "src/resources/questions/questions.model";
import { FindWithPaginationQueryDto } from "src/resources/users/dto/find-with-pagination-query.dto";
import { CourseStatuses } from "src/shared/constants/course-statuses";
import { Course } from "./courses.model";
import { CreateStructureCourseDto } from "./dto/create-structure-course.dto";

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course) private courseRepository: typeof Course,
    @InjectModel(CourseModule) private moduleRepository: typeof CourseModule,
    @InjectModel(Lesson) private lessonRepository: typeof Lesson
  ) {}

  async createCourse(dto: CreateStructureCourseDto, userId: number) {
    try {
      // Создаем курс
      const course = await this.courseRepository.create({
        title: dto.title,
        description: dto.description,
        audience: dto.audience,
        duration: dto.duration,
        goals: dto.goals,
        userId: userId,
        status: CourseStatuses.CREATED,
      });

      // Обработка модулей курса
      for (const moduleDto of dto.modules) {
        const courseModule = await this.moduleRepository.create({
          title: moduleDto.title,
          description: moduleDto.description,
          courseId: course.id,
        });

        // Обработка уроков
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
      // Получение курса по ID
      return await this.courseRepository.findByPk(id, {
        include: [
          { model: Lesson, include: [Question] }, // включаем уроки и вопросы
        ],
      });
    } catch (error) {
      throw new Error(`Ошибка при получении курса с ID ${id}: ${error.message}`);
    }
  }
}
