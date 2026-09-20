import { Logger } from '@nestjs/common';
import axios from 'axios';

export function createAxiosInstance(context = 'App') {
  const instance = axios.create();

  instance.interceptors.response.use(
    (r) => r,
    (e) => {
      if (axios.isAxiosError(e)) {
        Logger.error(
          `${e.config?.method?.toUpperCase()} ${instance.getUri(
            e.config,
          )} failed. ` +
            (e.config?.data
              ? `Request: ${JSON.stringify(e.config.data)}`
              : '') +
            (e.response?.data
              ? `Response Error: ${JSON.stringify(e.response?.data)}`
              : 'Error: ' + e.message),
          context,
        );
      } else {
        Logger.error(e, context);
      }
      return Promise.reject(e);
    },
  );

  return instance;
}
