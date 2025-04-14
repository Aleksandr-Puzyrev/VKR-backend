import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CourseModule } from "src/modules/modules.model";
import { Lesson } from "src/resources/lessons/lessons.model";
import { UsersModule } from "src/resources/users/users.module";
import { CoursesController } from "./courses.controller";
import { Course } from "./courses.model";
import { CoursesService } from "./courses.service";

@Module({
  imports: [forwardRef(() => UsersModule), SequelizeModule.forFeature([Course, CourseModule, Lesson])],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
