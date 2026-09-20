import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.get<string>(
      'permissions',
      context.getHandler(),
    );
    if (!permission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const admin = request.user;
    return checkPermission(admin, permission);
  }
}
export const checkPermission = (data, permission: string): boolean => {
  let isPermission = false;
  const check = data.permissions.includes(permission);
  if (check == true) {
    isPermission = true;
  } else {
    isPermission = false;
  }
  return isPermission;
};
