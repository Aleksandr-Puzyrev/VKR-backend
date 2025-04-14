import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { Course } from "src/resources/courses/courses.model";
import { Lesson } from "src/resources/lessons/lessons.model";

@Table({ tableName: "modules" })
export class CourseModule extends Model<CourseModule> {
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @ForeignKey(() => Course)
  @Column
  courseId: number;

  @BelongsTo(() => Course)
  course: Course;

  @HasMany(() => Lesson)
  lessons: Lesson[];
}
