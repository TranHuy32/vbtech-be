import { SetMetadata } from '@nestjs/common';
import { Perm } from '../constants';

export const PERMS_KEY = 'AccountPerms';

export const HasPerm = (...permissions: Perm[]) =>
  SetMetadata(PERMS_KEY, permissions);
