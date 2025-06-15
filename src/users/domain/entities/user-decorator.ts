import { Role } from '@prisma/client';

export class UserDecorator {
  id: string;
  email: string;
  name: string;
  role: Role;
  iat: number;
  exp: number;
}
