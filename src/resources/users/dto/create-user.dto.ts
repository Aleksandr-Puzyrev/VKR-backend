import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "example@mail.com", description: "Почтовый адрес" })
  @IsString({ message: "Должно быть строкой" })
  @IsEmail({}, { message: "Некорректный email" })
  readonly email: string;
  @ApiProperty({ example: "12345678", description: "Пароль" })
  @IsString({ message: "Должно быть строкой" })
  @Length(4, 16, { message: "Не меньше 4 и не больше 16" })
  readonly password: string;
}
