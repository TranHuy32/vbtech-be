import {
  AppBadRequestException,
  AppNotFoundException,
  ErrorCode,
} from '@app/core';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { UploadResponseDto } from './dto/upload-response.dto';
import { UploadFile } from './upload-file.type';

@Injectable()
export class UploadsService {
  private readonly uploadDir = join(process.cwd(), 'uploads');

  async saveImage(
    file: UploadFile,
    baseUrl: string,
  ): Promise<UploadResponseDto> {
    try {
      if (!file) throw new AppBadRequestException(ErrorCode.FILE_REQUIRED);

      await mkdir(this.uploadDir, { recursive: true });
      const filename = `${randomUUID()}${extname(file.originalname)}`;
      await writeFile(join(this.uploadDir, filename), file.buffer);

      return {
        filename,
        url: `${baseUrl}/api/v1/uploads/${filename}`,
      };
    } catch (error) {
      if (
        error instanceof AppBadRequestException ||
        error instanceof AppNotFoundException
      ) {
        throw error;
      }
      throw new AppBadRequestException(ErrorCode.FILE_UPLOAD_FAILED);
    }
  }

  getImagePath(filename: string) {
    if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
      throw new AppNotFoundException(ErrorCode.FILE_NOT_FOUND);
    }
    return join(this.uploadDir, filename);
  }
}
