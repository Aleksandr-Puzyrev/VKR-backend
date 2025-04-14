import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ModulesDto } from "src/resources/courses/dto/create-structure-course.dto";
import { ModulesService } from "./modules.service";

@Controller("modules")
export class ModulesController {
  constructor(private readonly ModulesService: ModulesService) {}

  @Post()
  create(@Body() dto: ModulesDto) {
    return this.ModulesService.create(dto);
  }

  @Get("/by-course/:courseId")
  getByCourse(@Param("courseId") courseId: number) {
    return this.ModulesService.findByCourse(+courseId);
  }
}
