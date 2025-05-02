import { ApiProperty } from "@nestjs/swagger";
import { BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Course } from "src/resources/courses/courses.model";
import { Role } from "src/resources/roles/roles.model";
import { UserRoles } from "src/resources/roles/user-roles.model";
import { UserCourses } from "./user-courses.model";

interface UserCreationAttr {
  email: string;
  password: string;
}

@Table({ tableName: "users" })
export class User extends Model<User, UserCreationAttr> {
  @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: "example@mail.com", description: "Почтовый адрес" })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @ApiProperty({ example: "12345678", description: "Пароль" })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @ApiProperty({ example: "true", description: "Забанен или нет" })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  banned: boolean;

  @ApiProperty({ example: "Хулиганство", description: "Причина блокировки" })
  @Column({ type: DataType.STRING, allowNull: true })
  banReason: string;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];

  @BelongsToMany(() => Course, () => UserCourses)
  courses: Course[];
}
