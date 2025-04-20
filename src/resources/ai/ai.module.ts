import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CoursesModule } from "src/resources/courses/courses.module";
import { AiTask } from "./ai-task.model";
import { AiController } from "./ai.controller";
import { AiService } from "./ai.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  controllers: [AiController],
  providers: [AiService],
  imports: [SequelizeModule.forFeature([AiTask]), CoursesModule, HttpModule],
  exports: [AiService],
})
export class AiModule {}
