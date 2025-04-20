import { CreateModuleCourseDto } from "src/resources/ai/dto/create-module-course.dto";

export const modulePrompt = (query: CreateModuleCourseDto, moduleId: number, lessonId: number) => {
  const lessonTitle = query.modules.find((module) => module.id === moduleId).lessons.find(lesson => lesson.id === lessonId).title;
  const moduleTitle = query.modules.find((module) => module.id === moduleId).title;
  const prompt = `Ты — эксперт по разработке учебных курсов. Сгенерируй полноценный урок со всей необходимой информацией на тему: "${lessonTitle}" из модуля ${moduleTitle} на основе этих данных о курсе: Название курса - ${query.title}, описание - ${query.description}, список названий всех модудей - ${query.modules.map((module) => module.title).join(", ")}.
  Обрати внимание:
  Не включай никаких пояснений или дополнительного текста вне структуры. 
  Требования: Теоретическая часть должна быть строго в официальном стиле примерно на 1000 токенов, разделенных на логические абзацы, только нумерованные списки если необходимы. 
  2. Поле questions обязательно и включи в нее 3-5 тестовых вопросов с вариантами ответов(Может быть только один правильный вариант ответа). 
  3. Не используй markdown или HTML-разметку в тексте. 
  4. Сохраняй академический тон изложения. 
  Возвращай ТОЛЬКО готовый JSON-объект без дополнительных комментариев.
  Формат ответа строго в JSON:
      {
        "title": "Название урока 1",
        "description": "Краткое описание",
        "questions": [
          {
            "questionText": "Формулировка тестового вопроса",
            "options": ["A", "B", "C", "D"],
            "answer": "Правильный вариант (например, A)"
          }
        ],
        "content": "Теоретическая часть"
      }
    Важно: Всегда завершай JSON полностью! Если не хватает места, сократи контент, но сохрани структуру.`;
  return prompt;
};
