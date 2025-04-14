import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CoursesService } from "./courses.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Course } from "./courses.model";
import { FindWithPaginationQueryDto } from "src/resources/users/dto/find-with-pagination-query.dto";
import { CreateStructureCourseDto } from "./dto/create-structure-course.dto";
import { GetUser } from "src/shared/decorators/get-user.decorator";

@Controller("courses")
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiOperation({ summary: "Создание курса" })
  @ApiResponse({ status: 200, type: Course })
  @Post()
  create(@GetUser('id') userId: number, @Body() dto: CreateStructureCourseDto) {
    return this.coursesService.createCourse(dto, userId);
  }

  @ApiOperation({ summary: "Получение всех курсов" })
  @ApiResponse({ status: 200, type: [Course] })
  @Get()
  findAll(@Query() dto: FindWithPaginationQueryDto) {
    return this.coursesService.getAllCourses(dto);
  }

  @ApiOperation({ summary: "Получение курса по id" })
  @ApiResponse({ status: 200, type: Course })
  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.coursesService.getCourseById(+id);
  }
}
