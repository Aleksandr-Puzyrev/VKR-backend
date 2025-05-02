import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Roles } from "src/resources/auth/roles-auth.decorator";
import { RolesGuard } from "src/resources/auth/roles.guard";
import { AddRoleDto } from "./dto/add-role.dto";
import { BanUserDto } from "./dto/ban-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { FindWithPaginationQueryDto } from "./dto/find-with-pagination-query.dto";
import { User } from "./users.model";
import { UsersService } from "./users.service";
import { AssignCourseDto } from "./dto/assign-course.dto";
import { Course } from "../courses/courses.model";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("users")
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: "Создание пользователя" })
  @ApiResponse({ status: 200, type: User })
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userService.createUser(userDto);
  }

  @ApiOperation({ summary: "Получение всех пользователей" })
  @ApiResponse({ status: 200, type: [User] })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Get()
  getAll(@Query() dto: FindWithPaginationQueryDto) {
    return this.userService.getAllUsers(dto);
  }

  @ApiOperation({ summary: "Выдать роль" })
  @ApiResponse({ status: 200 })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post("/role")
  addRole(@Body() dto: AddRoleDto) {
    return this.userService.addRole(dto);
  }

  @ApiOperation({ summary: "Забанить пользователя" })
  @ApiResponse({ status: 200 })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post("/ban")
  ban(@Body() dto: BanUserDto) {
    return this.userService.ban(dto);
  }

  @ApiOperation({ summary: "Назначить курс пользователю" })
  @ApiResponse({ status: 200, type: AssignCourseDto })
  @Post("/assign-course")
  assignCourse(@Body() dto: AssignCourseDto) {
    return this.userService.assignCourse(dto);
  }

  @ApiOperation({ summary: "Получить курсы пользователя" })
  @ApiResponse({ status: 200, type: [Course] })
  @Get("/:userId/courses")
  getUserCourses(@Param("userId") userId: number) {
    return this.userService.getUserCourses(userId);
  }

  @ApiOperation({ summary: "Получить данные текущего пользователя" })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("/profile")
  getMyProfile(@Req() req: { user: { id: number } }) {
    return this.userService.getMyProfile(req.user.id);
  }
}
