import { Role } from '@prisma/client';

export class CreateUserModel {
  name: string;

  email: string;

  password?: string;

  role: Role;

  photo?: string;

  birth_date?: string;

  tempPassword?: boolean;

  active: boolean;
}
