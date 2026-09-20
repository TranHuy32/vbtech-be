export * from './admin-action-type.enum';
export * from './perm.enum';
export * from './role.enum';

export const WS_EMITTER = 'ws_emitter::token';
export enum ProxyType {
  HTTP = 'http',
  HTTPS = 'https',
  SOCKET4 = 'socket4',
  SOCKET4A = 'socket4a',
  SOCKET5 = 'socket5',
}

export enum ProxyStatus {
  NOT_CHECK = 'not-check',
  LIVE = 'live',
  DIE = 'die',
}
export const ROLES = 'roles';
export const IS_PUBLIC_KEY = 'isPublic';
// export const keyRegex =
//   /^[\w-]{0,5}[:-][\w-]{0,4}[:-]{0,1}[\w-]{4,}[:-][\w-]{4,}[:-][\w-]{4,}$/;
export const keyRegex = /([\w]{4,5}[-])?([\w]{4,5}[:])?(?:[\w]{4,5}[-]?){4}/;

export enum OrderBy {
  DESC = 'DESC',
  ASC = 'ASC',
}
export enum Duration {
  Milisecond = 1,
  Second = Duration.Milisecond * 1000,
  Minute = Duration.Second * 60,
  Hour = Duration.Minute * 60,
}
