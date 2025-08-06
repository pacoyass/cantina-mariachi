
import { Prisma, PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const globalForPrisma = global;

let prisma;
try {
  prisma =globalForPrisma.prisma || new PrismaClient({
    transactionOptions: {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    maxWait: 10000, // default: 2000
    timeout: 50000, // default: 5000
  },
  }).$extends(withAccelerate());
} catch (error) {
  console.error('Failed to initialize Prisma Client:', error);
  throw error;
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
