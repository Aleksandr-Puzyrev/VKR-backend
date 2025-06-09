import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as uuid from 'uuid';
import * as path from 'path';
import * as fs from 'fs/promises';
import { Readable } from 'stream';

@Injectable()
export class FirebaseStorageService {
  private storage;

  constructor() {
    // Проверка конфигурационных переменных
    const missingEnvVars = [];
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID
    };

    // Проверяем, что все переменные окружения установлены
    Object.entries(firebaseConfig).forEach(([key, value]) => {
      if (!value) missingEnvVars.push(key);
    });

    if (missingEnvVars.length > 0) {
      throw new Error(`Missing Firebase config variables: ${missingEnvVars.join(', ')}`);
    }

    try {
      const app = initializeApp(firebaseConfig);
      this.storage = getStorage(app, `gs://${firebaseConfig.storageBucket}`);
    } catch (error) {
      console.error('Firebase initialization error:', error);
      throw new Error('Failed to initialize Firebase');
    }
  }

  // private async streamToBuffer(stream: Readable): Promise<Buffer> {
  //   return new Promise<Buffer>((resolve, reject) => {
  //     const chunks: Buffer[] = [];
  //     stream.on('data', (chunk) => chunks.push(chunk));
  //     stream.on('error', reject);
  //     stream.on('end', () => resolve(Buffer.concat(chunks)));
  //   });
  // }

  async uploadCourseImage(id: number, file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new Error('Файл не был загружен');
    }

    try {
      // Читаем файл с диска
      const fileBuffer = await fs.readFile(file.path);
      
      // Генерируем уникальное имя файла с сохранением расширения
      const fileExt = path.extname(file.originalname);
      const fileName = `courses/${id}/${uuid.v4()}${fileExt}`;
      const storageRef = ref(this.storage, fileName);

      // Загружаем файл в Firebase Storage
      try {
      await uploadBytes(storageRef, fileBuffer, {
        contentType: file.mimetype,
      });
    } catch(e) {
      console.log("uploudError", e)
    }

    await new Promise(resolve => setTimeout(resolve, 500));
      // Получаем URL для скачивания
      const downloadURL = await getDownloadURL(storageRef);

      // Удаляем временный файл
      await fs.unlink(file.path).catch(err => {
        console.error('Ошибка удаления временного файла:', err);
      });

      console.log('File available at:', downloadURL);

      return downloadURL;
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
      
      // Пытаемся удалить временный файл в случае ошибки
      if (file?.path) {
        await fs.unlink(file.path).catch(err => {
          console.error('Ошибка удаления временного файла после ошибки загрузки:', err);
        });
      }
      
      throw new Error(`Не удалось загрузить изображение: ${error.message}`);
    }
  }

}