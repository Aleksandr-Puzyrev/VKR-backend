import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, Table } from "sequelize-typescript";

interface AiTaskCreationAttrs {
  topic: string;
  result: string;
}

@Table({ tableName: "ai_tasks" })
export class AiTask extends Model<AiTask, AiTaskCreationAttrs> {
  @ApiProperty({ example: 1, description: "Уникальный ID запроса" })
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: "Основы программирования", description: "Тема курса" })
  @Column({ type: DataType.STRING, allowNull: false })
  topic: string;

  @ApiProperty({ example: "{}", description: "Сгенерированный результат" })
  @Column({ type: DataType.TEXT, allowNull: false })
  result: string;
}
