import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from "./resources/users/users.module";
import { ConfigModule } from "@nestjs/config";
import { User } from "./resources/users/users.model";
import { RolesModule } from "./resources/roles/roles.module";
import { Role } from "./resources/roles/roles.model";
import { UserRoles } from "./resources/roles/user-roles.model";
import { AuthModule } from "./resources/auth/auth.module";
import { CoursesModule } from "./resources/courses/courses.module";
import { Course } from "./resources/courses/courses.model";
import { FilesModule } from "./files/files.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from "path";
import { LessonsModule } from "./resources/lessons/lessons.module";
import { Lesson } from "./resources/lessons/lessons.model";
import { Question } from "./resources/questions/questions.model";
import { QuestionsModule } from "./resources/questions/questions.module";
import { AiTask } from "./resources/ai/ai-task.model";
import { AiModule } from "./resources/ai/ai.module";
import { ModulesModule } from './modules/modules.module';
import { CourseModule } from "./modules/modules.model";

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, "static"),
    }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Role, UserRoles, Course, Lesson, Question, AiTask, CourseModule],
      autoLoadModels: true,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    CoursesModule,
    FilesModule,
    LessonsModule,
    QuestionsModule,
    AiModule,
    ModulesModule,
  ],
})
export class AppModule {}
