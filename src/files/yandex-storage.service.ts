import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as uuid from 'uuid';
import EasyYandexS3 from 'easy-yandex-s3';
import { ConfigService } from '@nestjs/config';

interface UploadResult {
  Location: string;
  Key: string;
  Bucket: string;
}

@Injectable()
export class YandexStorageService {
  private readonly s3: EasyYandexS3;
  private readonly logger = new Logger(YandexStorageService.name);

  constructor(private readonly configService: ConfigService) {
    this.s3 = new EasyYandexS3({
      auth: {
        accessKeyId: this.configService.get('YC_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('YC_SECRET_ACCESS_KEY'),
      },
      Bucket: this.configService.get('YC_BUCKET_NAME'),
      debug: false,
    });
  }

  private isUploadResultArray(result: any): result is UploadResult[] {
    return Array.isArray(result);
  }

  private isUploadResult(result: any): result is UploadResult {
    return result && typeof result === 'object' && 'Location' in result;
  }

  async uploadCourseImage(id: number, file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new Error('Файл не был загружен');
    }

    try {
      const fileExt = path.extname(file.originalname);
      const fileName = `${uuid.v4()}${fileExt}`;
      const folderPath = `courses/${id}/`;

      const uploadResponse = await this.s3.Upload(
        {
          path: file.path,
          name: fileName,
        },
        `/${folderPath}`
      );

      // Обрабатываем разные типы возвращаемых значений
      let uploadResult: UploadResult;
      
      if (this.isUploadResultArray(uploadResponse)) {
        // Берем первый элемент массива (если загружали несколько файлов)
        uploadResult = uploadResponse[0];
      } else if (this.isUploadResult(uploadResponse)) {
        uploadResult = uploadResponse;
      } else {
        throw new Error('Неверный формат ответа от S3');
      }

      if (!uploadResult?.Location) {
        throw new Error('Не удалось получить URL загруженного файла');
      }

      await fs.unlink(file.path);
      this.logger.log(`Файл загружен: ${uploadResult.Location}`);
      return uploadResult.Location;
    } catch (error) {
      this.logger.error(`Ошибка загрузки: ${error.message}`);
      
      if (file?.path) {
        await fs.unlink(file.path).catch(err => {
          this.logger.error('Ошибка удаления временного файла:', err);
        });
      }
      
      throw new Error(`Не удалось загрузить изображение: ${error.message}`);
    }
  }

  // ... остальные методы остаются без изменений
}