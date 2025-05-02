import { forwardRef, Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./users.model";
import { Role } from "src/resources/roles/roles.model";
import { RolesModule } from "src/resources/roles/roles.module";
import { AuthModule } from "src/resources/auth/auth.module";
import { Course } from "src/resources/courses/courses.model";
import { CoursesModule } from "src/resources/courses/courses.module";
import { UserCourses } from "./user-courses.model";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Role, Course, UserCourses]),
    RolesModule,
    forwardRef(() => AuthModule),
    forwardRef(() => CoursesModule),
  ],
  exports: [UsersService],
})
export class UsersModule {}
