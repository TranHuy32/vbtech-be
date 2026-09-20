import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';

// Allow only images
export const imageFileFilter = (req, file, callback) => {
  const imageMimetype = [
    'image/jpeg',
    'image/png',
    'image/avif',
    'image/gif',
    'image/webp',
  ];

  if (!imageMimetype.includes(file.mimetype)) {
    // return callback(new Error('Only images and videos formats allowed!'));
    return callback(
      new HttpException(
        'Only image files are allowed!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }

  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(12)
    .fill(null)
    .map(() => Math.round(Math.random() * 32).toString(32))
    .join('');
  callback(null, `${randomName}${fileExtName}`);
};

export const imageMimetype = [
  'image/jpeg',
  'image/png',
  'image/avif',
  'image/gif',
  'image/webp',
];

export const fileFilter = (mimetype: string[]) => (req, file, callback) => {
  if (!mimetype.includes(file.mimetype)) {
    return callback(
      new HttpException('File type is not permitted', HttpStatus.BAD_REQUEST),
      false,
    );
  }
  callback(null, true);
};
