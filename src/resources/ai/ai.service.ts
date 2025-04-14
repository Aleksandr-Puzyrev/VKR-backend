import { Injectable } from "@nestjs/common";
import { CoursesService } from "src/resources/courses/courses.service";
import { CreateCourseDto } from "src/resources/courses/dto/create-course.dto";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { generateText } from "ai";
import { CreateStructureCourseDto } from "../courses/dto/create-structure-course.dto";
import { structurePrompt } from "src/shared/promts/structure-prompt";
import { modulePrompt } from "src/shared/promts/module-prompt";
import { CreateModuleCourseDto } from "./dto/create-module-course.dto";

@Injectable()
export class AiService {
  private deepseek;

  constructor(private coursesService: CoursesService) {
    this.deepseek = createDeepSeek({
      apiKey: process.env.DEEPSEEK_API_KEY ?? "",
      baseURL: "https://api.deepseek.com/v1",
      headers: {
        "X-Custom-Header": "NestJS-AI-Service",
      },
    });
  }

  async generateStructureCourse(topic: string) {
    try {
      const result = await generateText({
        model: this.deepseek("deepseek-chat"),
        system: "Ты — эксперт по созданию структурированных учебных курсов.",
        prompt: structurePrompt(topic),
      });

      if (!result.text) {
        throw new Error("Пустой ответ от DeepSeek");
      }

      const parsedCourse: CreateStructureCourseDto = JSON.parse(result.text);

      return parsedCourse;
    } catch (error) {
      throw new Error(`Ошибка генерации курса: ${error.message}`);
    }
  }

  async generateLesson(body: CreateModuleCourseDto) {
    try {
      const result = await generateText({
        model: this.deepseek("deepseek-chat"),
        system: "Ты — эксперт по созданию структурированных учебных курсов.",
        prompt: modulePrompt(body),
      });
    
      if (!result.text) {
        throw new Error("Пустой ответ от DeepSeek");
      }

      //TODO
      const parsedCourse: CreateModuleCourseDto = JSON.parse(result.text);

      return parsedCourse;
    } catch (error) {
      throw new Error(`Ошибка генерации курса: ${error.message}`);
    }
  }
}
