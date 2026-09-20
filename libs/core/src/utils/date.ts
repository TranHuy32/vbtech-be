import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

const calcZonedDate = (date, tz, fn, options = {}) => {
  const inputZoned = fromZonedTime(date, tz); // Chuyển đổi từ UTC sang múi giờ cụ thể
  const fnZoned = fn(inputZoned, options);
  return toZonedTime(fnZoned, tz); // Chuyển ngược kết quả về UTC
};

export const UTCZone = 'ETC/UTC';
export const VnTimezone = 'Asia/Ho_Chi_Minh';
export const getZonedEndOfDay = (date: Date, timeZone = UTCZone) => {
  return calcZonedDate(date, timeZone, endOfDay);
};
export const getZonedStartOfDay = (date: Date, timeZone = UTCZone) => {
  return calcZonedDate(date, timeZone, startOfDay);
};

export const getZonedEndOfWeek = (date: Date, timeZone = UTCZone) => {
  return calcZonedDate(date, timeZone, endOfWeek, { weekStartsOn: 1 });
};
export const getZonedStartOfWeek = (date: Date, timeZone = UTCZone) => {
  return calcZonedDate(date, timeZone, startOfWeek, { weekStartsOn: 1 });
};

export const getZonedEndOfMonth = (date: Date, timeZone = UTCZone) => {
  return calcZonedDate(date, timeZone, endOfMonth);
};
export const getZonedStartOfMonth = (date: Date, timeZone = UTCZone) => {
  return calcZonedDate(date, timeZone, startOfMonth);
};

export const getZonedEndOfYear = (date: Date, timeZone = UTCZone) => {
  return calcZonedDate(date, timeZone, endOfYear);
};
export const getZonedStartOfYear = (date: Date, timeZone = UTCZone) => {
  return calcZonedDate(date, timeZone, startOfYear);
};
