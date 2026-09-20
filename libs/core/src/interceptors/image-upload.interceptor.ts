import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AppBadRequestException, ErrorCode } from '@app/core';
import * as multer from 'multer';

export function FileUploadInterceptor({
  mimeTypes,
  maxSizeMB = 20,
}: {
  mimeTypes: string[];
  maxSizeMB?: number;
}) {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor('file', {
        storage: multer.memoryStorage(),
        limits: {
          fileSize: maxSizeMB * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
          if (!mimeTypes.includes(file.mimetype)) {
            return cb(
              new AppBadRequestException(ErrorCode.INVALID_FILE_TYPE),
              false,
            );
          }
          if (file.size > maxSizeMB * 1024 * 1024) {
            return cb(
              new AppBadRequestException(ErrorCode.FILE_TOO_LARGE),
              false,
            );
          }
          cb(null, true);
        },
      }),
    ),
  );
}

export function MultiFileUploadInterceptor({
  mimeTypes,
  maxSizeMB = 20,
  maxCount = 10,
  fieldName = 'files',
}: {
  mimeTypes: string[];
  maxSizeMB?: number;
  maxCount?: number;
  fieldName?: string;
}) {
  return applyDecorators(
    UseInterceptors(
      FilesInterceptor(fieldName, maxCount, {
        storage: multer.memoryStorage(),
        limits: {
          fileSize: maxSizeMB * 1024 * 1024, // 20MB mỗi file
        },
        fileFilter: (req, file, cb) => {
          if (!mimeTypes.includes(file.mimetype)) {
            return cb(
              new AppBadRequestException(ErrorCode.INVALID_FILE_TYPE),
              false,
            );
          }
          cb(null, true);
        },
      }),
    ),
  );
}
