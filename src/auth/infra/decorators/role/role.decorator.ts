import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: (Role | Role[])[]) => {
  const flatRoles = roles.flat();
  return SetMetadata(ROLES_KEY, flatRoles);
};
