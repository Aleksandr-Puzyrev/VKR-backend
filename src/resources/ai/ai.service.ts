import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { CoursesService } from "src/resources/courses/courses.service";
import { modulePrompt } from "src/shared/promts/module-prompt";
import { structurePrompt } from "src/shared/promts/structure-prompt";
import { v4 as uuidv4 } from "uuid";
import { CreateStructureCourseDto } from "../courses/dto/create-structure-course.dto";
import { CreateModuleCourseDto } from "./dto/create-module-course.dto";

@Injectable()
export class AiService {
  private readonly AUTH_URL = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth";
  private readonly API_URL = "https://gigachat.devices.sberbank.ru/api/v1/chat/completions";

  constructor(
    private readonly coursesService: CoursesService,
    private readonly httpService: HttpService
  ) {
    if (process.env.NODE_ENV === "development") {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }
  }

  private async getAccessToken(): Promise<string> {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      RqUID: uuidv4(),
      Authorization: `Basic ${process.env.GIGACHAT_CLIENT_SECRET}`,
    };

    const data = new URLSearchParams({ scope: "GIGACHAT_API_PERS" });

    const response = await firstValueFrom(
      this.httpService.post(this.AUTH_URL, data.toString(), { headers })
    );

    return response.data.access_token;
  }

  private async callGigaChat(prompt: string, systemMessage: string): Promise<string> {
    const accessToken = await this.getAccessToken();

    const body = {
      model: "GigaChat:latest",
      messages: [
        { role: "system", content: systemMessage + " Ответ должен быть полным валидным JSON." },
        {
          role: "user",
          content: prompt + " Заверши JSON полностью, включая все закрывающие скобки.",
        },
      ],
      temperature: 0.2,
      max_tokens: 4000,
      repetition_penalty: 1.2,
      stream: false,
    };

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await firstValueFrom(
      this.httpService.post(this.API_URL, body, { headers, timeout: 90000 })
    );

    return response.data.choices[0]?.message?.content ?? "";
  }

  async generateStructureCourse(topic: string): Promise<CreateStructureCourseDto> {
    const systemMessage =
      "Ты — эксперт по созданию структурированных учебных курсов. Отвечай строго в JSON формате.";
    try {
      const content = await this.callGigaChat(structurePrompt(topic), systemMessage);
      const json = this.extractJson(content);
      return JSON.parse(json);
    } catch (error) {
      throw new Error(`Ошибка генерации структуры курса: ${error.message}`);
    }
  }

  async generateLesson(
    query: CreateModuleCourseDto,
    moduleId: number,
    lessonId: number,
  ): Promise<CreateModuleCourseDto> {
    const systemMessage = `Ты — генератор учебного контента. Отвечай строго в JSON формате.`;

    try {
      const content = await this.callGigaChat(modulePrompt(query, moduleId, lessonId), systemMessage);
      console.log("content: ", content)
      const json = this.extractJson(content);
      return JSON.parse(json);
    } catch (error) {
      throw new Error(`Ошибка генерации урока: ${error.message}`);
    }
  }

  private extractJson(text: string): string {
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Ответ GigaChat не содержит корректного JSON");
    }
    return text.slice(jsonStart, jsonEnd);
  }
}
