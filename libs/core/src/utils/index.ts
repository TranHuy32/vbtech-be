import { customAlphabet } from 'nanoid';
import { Stream } from 'stream';

export * from './axios';
export * from './date';
// export * from './money';
// export * from './gdrive';
export * from './security';
export * from './sql';
export * from './strings';
// export * from './tele-send-noti';
export * from './upload.util';
const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoCode = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);

const nanoid = customAlphabet(alphabet, 21);
export function newId() {
  return nanoid();
}
export function newCode() {
  return nanoCode();
}
export const nanoid09az = customAlphabet(
  '0123456789zyxwvutsrqponmlkjihgfedcba',
  8,
);
export const nanoidaz = customAlphabet('zyxwvutsrqponmlkjihgfedcba', 1);
export const genUsername = async (size?: number) => {
  if (!size) size = 12;
  return `${await nanoidaz()}${await nanoid09az(size - 1)}`;
};

export const genUsernameWithPrefix = async (prefix: string) =>
  `${prefix}${await nanoid09az(12 - prefix.length)}`;

export function truncateDate(date: Date, coeff: number) {
  return new Date(Math.floor(date.getTime() / coeff) * coeff);
}

type Callback = (e: Error, result?: string) => void;
export function streamToString(
  stream: Stream,
  enc?: string | Callback,
  cb?: Callback,
) {
  let str = '';
  if (typeof enc === 'function') {
    cb = enc;
    enc = null;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cb = cb || (() => {});
  return new Promise<string>(function (resolve, reject) {
    stream.on('data', function (data) {
      str += typeof enc === 'string' ? data.toString(enc) : data.toString();
    });
    stream.on('end', function () {
      resolve(str);
      cb(null, str);
    });
    stream.on('error', function (err) {
      reject(err);
      cb(err);
    });
  });
}

export function formatCurrency(value) {
  const parts = value.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export const getDeviceInfo = (
  headers: any,
): {
  userAgent: string;
  device: string;
  macAddress: string;
} => {
  return {
    userAgent: headers['user-agent'],
    device: headers['user_device'],
    macAddress: headers['user_mac_address'],
  };
};

export function getIp(rawIp: string) {
  if (rawIp.slice(0, 7) == '::ffff:') {
    return rawIp.slice(7);
  }

  return rawIp;
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomFloat(min: number, max: number) {
  return +(Math.random() * (max - 1 - min + 1) + min).toFixed(2);
}
export const escapeMarkdown = (text: string) => {
  return text.replace(/[_*[\]()~`>#+-=|{}.!]/g, '\\$&');
};
