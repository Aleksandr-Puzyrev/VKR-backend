export class CreateQuestionDto {
  question: string;
  options: string[];
  answer: string;
}

export class CreateLessonDto {
  title: string;
  content: string;
  questions?: CreateQuestionDto[];
}

export class CreateCourseDto {
  userId: number;
  title: string;
  description: string;
  lessons: CreateLessonDto[];
}
