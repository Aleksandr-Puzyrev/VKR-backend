import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { FindWithPaginationQueryDto } from "src/resources/users/dto/find-with-pagination-query.dto";
import { GetUser } from "src/shared/decorators/get-user.decorator";
import { Roles } from "../auth/roles-auth.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { UpdateLessonDto } from "../lessons/dto/update-lesson.dto";
import { Lesson } from "../lessons/lessons.model";
import { Course } from "./courses.model";
import { CoursesService } from "./courses.service";
import { CreateStructureCourseDto, ModulesDto } from "./dto/create-structure-course.dto";
import { UpdateCourseStatusDto } from "./dto/update-course-status.dto";
import { UploadImageDto } from "./dto/upload-image.dto";
import { AvatarUploadValidationPipe } from "src/shared/pipes/avatar-upload.validation";

@Controller("courses")
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiOperation({ summary: "Создание курса" })
  @ApiResponse({ status: 200, type: Course })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post()
  create(@GetUser("id") userId: number, @Body() dto: CreateStructureCourseDto) {
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

  @ApiOperation({ summary: "Редактирование модуля по id" })
  @ApiResponse({ status: 200, type: ModulesDto })
  @Put("course-module/:id")
  updateModule(@Param("id") id: number, @Body() dto: ModulesDto) {
    return this.coursesService.updateModule(id, dto);
  }

  @ApiOperation({ summary: "Редактирование урока по id в модуле" })
  @ApiResponse({ status: 200, type: Lesson })
  @Put("module/:moduleId/lesson/:lessonId")
  updateLesson(
    @Param("moduleId") moduleId: number,
    @Param("lessonId") lessonId: number,
    @Body() dto: UpdateLessonDto
  ) {
    return this.coursesService.updateLesson(+moduleId, +lessonId, dto);
  }

  @ApiOperation({ summary: "Обновление статуса курса" })
  @ApiResponse({ status: 200, type: Course })
  @Put(":id/status")
  async updateCourseStatus(@Param("id") id: number, @Body() dto: UpdateCourseStatusDto) {
    return this.coursesService.updateCourseStatus(+id, dto.status);
  }

  @ApiOperation({ summary: "Загрузка изображения курса" })
  @ApiResponse({ status: 200, type: Course })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCourseImage(
    @Param('id') id: number,
    @Body() _: UploadImageDto,
    @UploadedFile(AvatarUploadValidationPipe) file: Express.Multer.File
  ) {
    return this.coursesService.uploadCourseImage(Number(id), file);
  }

  @ApiOperation({ summary: "Удаление изображения курса" })
  @ApiResponse({ status: 200, type: Course })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Delete(':id/image')
  async deleteCourseImage(@Param('id') id: number) {
    return this.coursesService.deleteCourseImage(+id);
  }
}
