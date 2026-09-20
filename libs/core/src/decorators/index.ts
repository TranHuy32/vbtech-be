import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { Role, IS_PUBLIC_KEY, ROLES } from '../constants';

export * from './bigint-column';
export * from './bignumber-transform';
export * from './permission';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const RequireRole = (...depth: Role[]) => SetMetadata(ROLES, depth);

export const RequireAdmin = () => RequireRole(Role.Admin);
export const RequireUser = () => RequireRole(Role.User);
