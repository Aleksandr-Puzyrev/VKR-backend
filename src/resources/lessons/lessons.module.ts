import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Lesson } from "./lessons.model";
import { LessonsController } from "./lessons.controller";
import { LessonsService } from "./lessons.service";

@Module({
  imports: [SequelizeModule.forFeature([Lesson])],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}
