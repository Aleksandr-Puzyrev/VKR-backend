import { SequelizeModule } from "@nestjs/sequelize";
import { Lesson } from "./lessons.model";
import { LessonsController } from "./lessons.controller";
import { LessonsService } from "./lessons.service";
import { Course } from "../courses/courses.model";
import { CourseModule } from "src/modules/modules.model";
import { Module } from "@nestjs/common";

@Module({
  imports: [SequelizeModule.forFeature([Lesson, CourseModule, Course])],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}
