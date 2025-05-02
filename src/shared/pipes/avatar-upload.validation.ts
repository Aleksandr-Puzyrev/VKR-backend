import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as mime from "mime-types";

@Injectable()
export class AvatarUploadValidationPipe implements PipeTransform {
  private readonly _avatarMaxSize: number;
  private readonly _avatarExtensions: string;
  constructor(private readonly configService: ConfigService) {
    this._avatarMaxSize = parseInt(this.configService.get("AVATAR_MAX_SIZE", "5242880"));
    this._avatarExtensions = this.configService
      .get("AVATAR_EXTENSIONS", "jpg,jpeg,png,gif,webp")
      .split(",")
      .map((ext) => ext.trim().toLowerCase());
  }
  async transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("Файл отсутствует");
    }
    if (!file.size) {
      throw new BadRequestException("Размер файла 0");
    }
    if (file.size > this._avatarMaxSize) {
      throw new BadRequestException("Файл слишком большой");
    }
    const extension = mime.extension(file.mimetype);
    if (!extension) {
      throw new BadRequestException("Формат файла не определен");
    }

    const extLower = extension.toLowerCase();
    if (!this._avatarExtensions.includes(extLower)) {
      throw new BadRequestException(
        `Формат ${extLower} не подходит, доступны только ${this._avatarExtensions}`
      );
    }
    return file;
  }
}
