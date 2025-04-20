import { Lesson } from "src/resources/lessons/lessons.model";
import {
  CreateStructureCourseDto
} from "../../courses/dto/create-structure-course.dto";

export class CreatedModulesDto {
  id: number;
  title: string;
  description: string;
  lessons?: Lesson[];
}
interface CreateModuleCourse extends Omit<CreateStructureCourseDto, "modules"> {
  modules: CreatedModulesDto[];
}

export class CreateModuleCourseDto implements CreateModuleCourse {
  title: string;
  description: string;
  audience: string;
  duration: string;
  goals: string;
  modules: CreatedModulesDto[];
}
