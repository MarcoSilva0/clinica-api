import { Role } from '@prisma/client';

export class UpdateUserModel {
  name: string;

  role: Role;

  photo?: string;

  birth_date?: string;

  tempPassword?: boolean;

  active: boolean;
}
