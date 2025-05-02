import { Table, Column, Model, ForeignKey } from "sequelize-typescript";
import { User } from "./users.model";
import { Course } from "../courses/courses.model";

@Table({ tableName: "user_courses", timestamps: false })
export class UserCourses extends Model {
  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  userId: number;

  @ForeignKey(() => Course)
  @Column({ field: 'course_id' })
  courseId: number;
}