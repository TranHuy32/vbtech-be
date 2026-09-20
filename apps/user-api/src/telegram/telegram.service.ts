import { AppBadRequestException, ErrorCode } from '@app/core';
import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { SendTelegramMessageDto } from './dto/send-telegram-message.dto';

@Injectable()
export class TelegramService {
  private bot?: TelegramBot;

  async sendFromContactForm(dto: SendTelegramMessageDto) {
    try {
      const token = process.env.TELEGRAM_BOT_TOKEN;
      const chatId =
        process.env.TELEGRAM_GROUP_ID ?? process.env.TELEGRAM_ERROR_GROUP;
      if (!token || !chatId) {
        throw new AppBadRequestException(ErrorCode.TELEGRAM_CONFIG_MISSING);
      }

      await this.getBot(token).sendMessage(chatId, this.formatMessage(dto), {
        disable_web_page_preview: true,
      });

      return { success: true };
    } catch (error) {
      if (error instanceof AppBadRequestException) throw error;
      throw new AppBadRequestException(ErrorCode.TELEGRAM_SEND_FAILED);
    }
  }

  private getBot(token: string) {
    this.bot ??= new TelegramBot(token, { polling: false });
    return this.bot;
  }

  private formatMessage(dto: SendTelegramMessageDto) {
    return [
      '🔔 YÊU CẦU MỚI TỪ WEBSITE',
      '\n',
      `👤 Khách hàng: ${dto.full_name}`,
      dto.phone ? `📞 Số điện thoại: ${dto.phone}` : null,
      dto.email ? `✉️ Email: ${dto.email}` : null,
      dto.company ? `🏢 Công ty: ${dto.company}` : null,
      '',
      `💬 Nội dung: ${dto.message}`,
    ]
      .filter(Boolean)
      .join('\n');
  }
}
