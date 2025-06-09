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
import { MulterModule } from "@nestjs/platform-express";
import { FilesService } from "src/files/files.service";
import { FilesModule } from "src/files/files.module";
import { ConfigModule } from "@nestjs/config";
import { UserCourses } from "../users/user-courses.model";
import { FirebaseStorageService } from "src/files/firebase-storage.service";
import { YandexStorageService } from "src/files/yandex-storage.service";

@Module({
  imports: [
    forwardRef(() => UsersModule),
    SequelizeModule.forFeature([Course, CourseModule, Lesson, Question, UserCourses]),
    AuthModule,
    MulterModule.register({
      dest: "../../../static/courses",
    }),
    FilesModule,
    ConfigModule,
  ],
  controllers: [CoursesController],
  providers: [CoursesService, FilesService, FirebaseStorageService, YandexStorageService],
  exports: [CoursesService],
})
export class CoursesModule {}
