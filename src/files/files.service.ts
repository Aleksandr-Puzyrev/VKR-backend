import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import * as uuid from "uuid";

@Injectable()
export class FilesService {
  private readonly uploadPath = path.resolve(__dirname, "..", "..", "static", "courses");

  constructor() {
    this.ensureUploadDirectoryExists();
  }

  private ensureUploadDirectoryExists() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async createCourseImage(file: Express.Multer.File): Promise<string> {
    try {
      // Добавьте проверки
      if (!file) {
        throw new HttpException("Файл не предоставлен", HttpStatus.BAD_REQUEST);
      }
      
      if (!file.buffer && !file.originalname) {
        throw new HttpException("Некорректный файл", HttpStatus.BAD_REQUEST);
      }
  
      const fileExt = path.extname(file.originalname);
      const fileName = uuid.v4() + fileExt;
      const filePath = path.join(this.uploadPath, fileName);
  
      // Используйте file.buffer если есть, иначе читайте из временного пути
      if (file.buffer) {
        await fs.promises.writeFile(filePath, file.buffer);
      } else if (file.path) {
        await fs.promises.copyFile(file.path, filePath);
        await fs.promises.unlink(file.path); // Удаляем временный файл
      } else {
        throw new HttpException("Не удалось обработать файл", HttpStatus.BAD_REQUEST);
      }
  
      return `courses/${fileName}`;
    } catch (e) {
      console.error('File save error:', e);
      throw new HttpException(
        `Ошибка при сохранении изображения: ${e.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      const fullPath = path.resolve(__dirname, "..", "static", filePath);
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
      }
    } catch (e) {
      throw new HttpException(
        "Ошибка при удалении файла",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
