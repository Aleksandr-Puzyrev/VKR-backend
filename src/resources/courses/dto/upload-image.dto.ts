import { ApiProperty } from '@nestjs/swagger';

export class UploadImageDto {
  @ApiProperty({ format: 'binary', type: 'string', name: 'file' })
  file: Express.Multer.File;
}
