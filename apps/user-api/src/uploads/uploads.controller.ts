import { imageMimetype } from '@app/core';
import { FileUploadInterceptor } from '@app/core/interceptors/image-upload.interceptor';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UploadResponseDto } from './dto/upload-response.dto';
import { UploadFile } from './upload-file.type';
import { UploadsService } from './uploads.service';

@ApiTags('Uploads')
@Controller({
  path: 'uploads',
  version: '1',
})
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('images')
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @FileUploadInterceptor({ mimeTypes: imageMimetype, maxSizeMB: 5 })
  uploadImage(
    @UploadedFile() file: UploadFile,
    @Req() req: Request,
  ): Promise<UploadResponseDto> {
    return this.uploadsService.saveImage(
      file,
      `${req.protocol}://${req.get('host')}`,
    );
  }

  @Get(':filename')
  viewImage(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(this.uploadsService.getImagePath(filename));
  }
}
