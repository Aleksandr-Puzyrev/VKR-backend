import { Injectable } from '@nestjs/common';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as uuid from 'uuid';
import * as path from 'path';

@Injectable()
export class FirebaseStorageService {
  private storage;

  constructor() {
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID
    };

    const app = initializeApp(firebaseConfig);
    this.storage = getStorage(app);
  }

  async uploadCourseImage(file: Express.Multer.File): Promise<string> {
    try {
      const fileExt = path.extname(file.originalname);
      const fileName = `courses/${uuid.v4()}${fileExt}`;
      const storageRef = ref(this.storage, fileName);

      // Загружаем файл
      await uploadBytes(storageRef, file.buffer, {
        contentType: file.mimetype,
      });

      // Получаем публичный URL
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload image');
    }
  }
}