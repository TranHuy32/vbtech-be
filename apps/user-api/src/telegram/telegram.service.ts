import { AppBadRequestException, ErrorCode } from '@app/core';
import { Injectable, Logger } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { SendTelegramMessageDto } from './dto/send-telegram-message.dto';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private bot?: TelegramBot;
  private migratedChatId?: string;

  async sendFromContactForm(dto: SendTelegramMessageDto) {
    try {
      const token = process.env.TELEGRAM_BOT_TOKEN;
      const configuredChatId =
        process.env.TELEGRAM_GROUP_ID ?? process.env.TELEGRAM_ERROR_GROUP;
      if (!token || !configuredChatId) {
        throw new AppBadRequestException(ErrorCode.TELEGRAM_CONFIG_MISSING);
      }

      const bot = this.getBot(token);
      const message = this.formatMessage(dto);
      const options = { disable_web_page_preview: true };
      const chatId = this.migratedChatId ?? configuredChatId;

      try {
        await bot.sendMessage(chatId, message, options);
      } catch (error) {
        const migratedChatId = this.getMigratedChatId(error);
        if (!migratedChatId) throw error;

        this.migratedChatId = migratedChatId;
        this.logger.warn(
          `Telegram group đã chuyển sang supergroup. Chat ID mới để cập nhật TELEGRAM_GROUP_ID=${migratedChatId}`,
        );
        await bot.sendMessage(migratedChatId, message, options);
      }

      return { success: true };
    } catch (error) {
      const chatId =
        process.env.TELEGRAM_GROUP_ID ?? process.env.TELEGRAM_ERROR_GROUP;
      this.logger.error(
        `Không thể gửi yêu cầu Telegram (chat=${this.maskChatId(chatId)}): ${this.errorMessage(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      if (error instanceof AppBadRequestException) throw error;
      throw new AppBadRequestException(ErrorCode.TELEGRAM_SEND_FAILED);
    }
  }

  private getBot(token: string) {
    this.bot ??= new TelegramBot(token, { polling: false });
    return this.bot;
  }

  private maskChatId(chatId?: string) {
    if (!chatId) return 'missing';
    return chatId.length <= 4 ? '***' : `***${chatId.slice(-4)}`;
  }

  private errorMessage(error: unknown) {
    if (!(error instanceof Error)) return String(error);
    const telegramError = error as Error & {
      code?: string;
      response?: {
        body?: {
          error_code?: number;
          description?: string;
          parameters?: { migrate_to_chat_id?: number | string };
        };
      };
    };
    const body = telegramError.response?.body;
    return [
      telegramError.message,
      telegramError.code ? `code=${telegramError.code}` : null,
      body?.error_code ? `telegram_code=${body.error_code}` : null,
      body?.description ? `description=${body.description}` : null,
    ]
      .filter(Boolean)
      .join(' | ');
  }

  private getMigratedChatId(error: unknown) {
    const telegramError = error as {
      response?: {
        body?: { parameters?: { migrate_to_chat_id?: number | string } };
      };
    };
    const value = telegramError?.response?.body?.parameters?.migrate_to_chat_id;
    return value === undefined ? null : String(value);
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
