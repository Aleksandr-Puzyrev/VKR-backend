import { ApiProperty } from "@nestjs/swagger";
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
import { User } from "src/resources/users/users.model";
import { CourseStatuses } from "src/shared/constants/course-statuses";

@Table({ tableName: "courses" })
export class Course extends Model<Course> {
  @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: "Курс по программированию", description: "Название курса" })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @ApiProperty({ example: "Краткое описание курса", description: "Описание курса" })
  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @ApiProperty({ example: "новички", description: "Для кого предназначен курс" })
  @Column({ type: DataType.TEXT, allowNull: false })
  audience: string;

  @ApiProperty({ example: "5 часов", description: "Ожидаемое время прохождения" })
  @Column({ type: DataType.TEXT, allowNull: false })
  duration: string;

  @ApiProperty({ example: "Цель 1", description: "Цели курса" })
  @Column({ type: DataType.STRING, allowNull: false })
  goals: string;

  @ApiProperty({ example: "CREATED", description: "Статус курса" })
  @Column({ type: DataType.TEXT })
  status: keyof typeof CourseStatuses;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => CourseModule)
  modules: CourseModule[];
}
