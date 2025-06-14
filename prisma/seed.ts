// prisma/seed.ts

import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcryptjs';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  const saltRounds = 10;
  const passwordCrypt = await hash('admin', saltRounds);

  const user_default = await prisma.users.upsert({
    where: {
      email: 'admin@admin.com',
    },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@admin.com',
      password: passwordCrypt,
      role: Role.ADMIN,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log(`User created: ${user_default.name} (${user_default.email})`);
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
