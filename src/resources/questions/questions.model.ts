import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Lesson } from '../lessons/lessons.model';

@Table({ tableName: 'questions' })
export class Question extends Model<Question> {
  @Column({ type: DataType.TEXT })
  questionText: string;  // текст вопроса

  @Column({ type: DataType.JSONB })
  options: string[]; // варианты ответов (массив строк)

  @Column({ type: DataType.STRING })
  answer: string; // правильный ответ

  @ForeignKey(() => Lesson)
  @Column
  lessonId: number; // привязка к уроку

  @BelongsTo(() => Lesson)
  lesson: Lesson;
}
