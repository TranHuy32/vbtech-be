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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Public } from '@app/core';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { Request, Response } from 'express';
import { UploadResponseDto } from './dto/upload-response.dto';
import { UploadFile } from './upload-file.type';
import { UploadsService } from './uploads.service';

@ApiTags('Uploads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
  @Public()
  viewImage(@Param('filename') filename: string, @Res() res: Response) {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    return res.sendFile(this.uploadsService.getImagePath(filename));
  }
}
