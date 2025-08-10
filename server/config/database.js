
import { Prisma, PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const createTestPrismaStub = () => {
  const stub = {
    user: {},
    order: {},
    orderItem: {},
    driver: {},
    category: {},
    menuItem: {},
    cashTransaction: {},
    cashSummary: {},
    activityLog: {},
    systemLog: {},
    notificationLog: {},
    refreshToken: {},
    blacklistedToken: {},
    webhook: {},
    webhookLog: {},
    $transaction: async (cb) => cb(stub),
    $connect: async () => {},
    $disconnect: async () => {},
  };
  return stub;
};

function createRealPrismaClient() {
  const globalForPrisma = global;
  let client;
  try {
    client = globalForPrisma.prisma || new PrismaClient({
      transactionOptions: {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 10000,
        timeout: 50000,
      },
    }).$extends(withAccelerate());
  } catch (error) {
    console.error('Failed to initialize Prisma Client:', error);
    throw error;
  }

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client;
  }
  return client;
}

const prisma = process.env.NODE_ENV === 'test' ? createTestPrismaStub() : createRealPrismaClient();

export default prisma;
