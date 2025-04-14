import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { CourseModule } from "src/modules/modules.model";
import { Question } from "src/resources/questions/questions.model";

@Table({ tableName: "lessons" })
export class Lesson extends Model<Lesson> {
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.TEXT })
  content: string;

  @ForeignKey(() => CourseModule)
  @Column
  moduleId: number;

  @BelongsTo(() => CourseModule)
  module: CourseModule;

  @HasMany(() => Question)
  questions: Question[];
}
