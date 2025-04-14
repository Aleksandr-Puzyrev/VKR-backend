import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CourseModule } from "./modules.model";
import { ModulesDto } from "src/resources/courses/dto/create-structure-course.dto";

@Injectable()
export class ModulesService {
  constructor(@InjectModel(CourseModule) private moduleRepo: typeof CourseModule) {}

  async create(dto: ModulesDto) {
    return this.moduleRepo.create(dto);
  }

  async findByCourse(courseId: number) {
    return this.moduleRepo.findAll({ where: { courseId }, include: { all: true } });
  }
}
