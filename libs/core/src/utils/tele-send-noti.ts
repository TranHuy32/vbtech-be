import { Logger } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

export const NotiBot: TelegramBot = new TelegramBot(
  process.env.TELEGRAM_BOT_TOKEN,
  {
    polling: true,
  },
);

export const sendNotiError = async (str: string) => {
  try {
    await NotiBot.sendMessage(process.env.TELEGRAM_ERROR_GROUP, str, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });
  } catch (error) {
    Logger.error(
      `Send Error Notification: ${error.message}`,
      error.stack,
      'Telegram',
    );
  }
};

export const sendMessage = async (
  str: string,
  parse_mode: TelegramBot.ParseMode = 'Markdown',
  chatId = process.env.TELEGRAM_ERROR_GROUP,
) => {
  try {
    return await NotiBot.sendMessage(chatId, str, {
      parse_mode,
      disable_web_page_preview: true,
    });
  } catch (error) {
    Logger.error(
      `Send Error Notification: ${error.message}`,
      error.stack,
      'Telegram',
    );
  }
};
export const deleteMessage = async (
  chatId: TelegramBot.ChatId,
  messageId: number,
) => {
  try {
    await NotiBot.deleteMessage(chatId, messageId);
  } catch (error) {
    Logger.error(
      `Send Error Notification: ${error.message}`,
      error.stack,
      'Telegram',
    );
  }
};
export const sendDocument = async (
  chatId: TelegramBot.ChatId,
  file: Buffer,
  filename: string,
) => {
  try {
    await NotiBot.sendDocument(
      chatId ? chatId : process.env.TELEGRAM_ERROR_GROUP,
      file,
      {},
      { filename, contentType: 'application/octet-stream' },
    );
  } catch (error) {
    Logger.error(
      `Send Error Notification: ${error.message}`,
      error.stack,
      'Telegram',
    );
  }
};
