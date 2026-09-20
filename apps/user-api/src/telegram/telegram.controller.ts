import { Public } from '@app/core';
import { TransformResponseInterceptor } from '@app/core/interceptors/transform-response.interceptor';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SendTelegramMessageDto } from './dto/send-telegram-message.dto';
import { TelegramService } from './telegram.service';

@ApiTags('Telegram')
@Controller({
  path: 'telegram',
  version: '1',
})
@UseInterceptors(TransformResponseInterceptor)
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Public()
  @Post('messages')
  @HttpCode(HttpStatus.OK)
  sendMessage(@Body() dto: SendTelegramMessageDto) {
    return this.telegramService.sendFromContactForm(dto);
  }
}
