import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Lesson } from '../lessons/lessons.model';

@Table({ tableName: 'questions' })
export class Question extends Model<Question> {
  @Column({ type: DataType.TEXT })
  questionText: string;

  @Column({ type: DataType.JSONB })
  options: string[];

  @Column({ type: DataType.STRING })
  answer: string;

  @ForeignKey(() => Lesson)
  @Column
  lessonId: number;

  @BelongsTo(() => Lesson)
  lesson: Lesson;
}
