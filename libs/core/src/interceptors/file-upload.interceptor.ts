import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';

export function UploadInterceptor(
  allowedMimeTypes: string[],
  fieldName = 'file',
) {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, {
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {
          if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
          } else {
            cb(new Error('Invalid file type'), false);
          }
        },
      }),
    ),
  );
}
