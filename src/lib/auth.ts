import { betterAuth } from 'better-auth';
import { prisma } from './prisma';
import { prismaAdapter } from 'better-auth/adapters/prisma';

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
});