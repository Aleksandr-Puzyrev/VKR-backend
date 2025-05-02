import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CoursesModule } from "src/resources/courses/courses.module";
import { AiTask } from "./ai-task.model";
import { AiController } from "./ai.controller";
import { AiService } from "./ai.service";
import { HttpModule } from "@nestjs/axios";
import { LessonsModule } from "../lessons/lessons.module";
import { Lesson } from "../lessons/lessons.model";

@Module({
  controllers: [AiController],
  providers: [AiService],
  imports: [SequelizeModule.forFeature([AiTask, Lesson]), CoursesModule, HttpModule, LessonsModule],
  exports: [AiService],
})
export class AiModule {}
