import { createHmac } from 'crypto';

export const hmacSHA512 = (content: string, secret: string) => {
  return createHmac('sha512', secret)
    .update(content)
    .digest('hex')
    .toUpperCase();
};
