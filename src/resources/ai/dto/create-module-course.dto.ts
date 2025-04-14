import { CreateStructureCourseDto, ModulesDto } from '../../courses/dto/create-structure-course.dto';

interface CreateModuleCourse extends Omit<CreateStructureCourseDto, 'modules'> {
  modules: ModulesDto;
}

export class CreateModuleCourseDto implements CreateModuleCourse {
  title: string;
  description: string;
  audience: string;
  duration: string;
  goals: string[];
  modules: ModulesDto;
}
