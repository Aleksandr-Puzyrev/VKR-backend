import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CourseModule } from "src/modules/modules.model";
import { Lesson } from "src/resources/lessons/lessons.model";
import { UsersModule } from "src/resources/users/users.module";
import { CoursesController } from "./courses.controller";
import { Course } from "./courses.model";
import { CoursesService } from "./courses.service";
import { AuthModule } from "../auth/auth.module";
import { Question } from "../questions/questions.model";

@Module({
  imports: [forwardRef(() => UsersModule), SequelizeModule.forFeature([Course, CourseModule, Lesson, Question]), AuthModule],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
