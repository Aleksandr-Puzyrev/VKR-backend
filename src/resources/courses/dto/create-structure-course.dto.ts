import { Lesson } from "src/resources/lessons/lessons.model";

export class QuestionDto {
  questionText: string;
  options: string[];
  answer: string;
}

export class ModulesDto {
  title: string;
  description: string;
  lessons?: Lesson[];
}

export class CreateStructureCourseDto {
  title: string;
  description: string;
  audience: string;
  duration: string;
  goals: string;
  modules: ModulesDto[];
}
