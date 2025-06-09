import { Module } from "@nestjs/common";
import { FilesService } from "./files.service";
import { FirebaseStorageService } from "./firebase-storage.service";
import { YandexStorageService } from "./yandex-storage.service";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [FilesService, FirebaseStorageService, YandexStorageService, ConfigService],
  exports: [FilesService, FirebaseStorageService, YandexStorageService],
})
export class FilesModule {}
