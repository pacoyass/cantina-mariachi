import { PrismaClient, UserRole, OrderType, OrderStatus, ReservationStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seed() {
  // Clear existing data
  await prisma.$executeRaw`
  DO $$ 
  DECLARE
    table_exists boolean;
  BEGIN
    FOR table_exists IN (
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN (
          'users', 'drivers', 'app_config', 'categories', 'menu_items', 
          'orders', 'order_items', 'cash_transactions', 'cash_summary', 
          'audit_logs', 'notifications', 'reservations', 'refresh_tokens', 
          'blacklisted_tokens', 'cron_locks', 'cron_runs', 'webhooks', 
          'integrations', 'user_preferences', 'localizations'
        )
      )
    ) LOOP
      IF table_exists THEN
        EXECUTE 'TRUNCATE TABLE "users", "drivers", "app_config", "categories", "menu_items", 
                 "orders", "order_items", "cash_transactions", "cash_summary", 
                 "audit_logs", "notifications", "reservations", "refresh_tokens", 
                 "blacklisted_tokens", "cron_locks", "cron_runs", "webhooks", 
                 "integrations", "user_preferences", "localizations" CASCADE';
      END IF;
    END LOOP;
  END $$;
`;
  
  // Hash passwords
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Users
  await prisma.user.createMany({
    data: [
      { email: 'owner@example.com', name: 'Owner', role: UserRole.OWNER, password: hashedPassword, phone: '1234567890', isActive: true },
      { email: 'admin@example.com', name: 'Manager', role: UserRole.ADMIN, password: hashedPassword, phone: '1234567891', isActive: true },
      { email: 'cook@example.com', name: 'Cook', role: UserRole.COOK, password: hashedPassword, phone: '1234567892', isActive: true },
      { email: 'waiter@example.com', name: 'Waiter', role: UserRole.WAITER, password: hashedPassword, phone: '1234567893', isActive: true },
      { email: 'cashier@example.com', name: 'Cashier', role: UserRole.CASHIER, password: hashedPassword, phone: '1234567894', isActive: true },
      { email: 'customer1@example.com', name: 'Customer One', role: UserRole.CUSTOMER, password: hashedPassword, phone: '1234567895', isActive: true },
      { email: 'customer2@example.com', name: 'Customer Two', role: UserRole.CUSTOMER, password: hashedPassword, phone: '1234567896', isActive: true },
      { email: 'inactive@example.com', name: 'Inactive User', role: UserRole.CUSTOMER, password: hashedPassword, phone: '1234567897', isActive: false },
    ],
  });

  // Fetch users
  const [owner, admin, cook, customer1, customer2] = await Promise.all([
    prisma.user.findUnique({ where: { email: 'owner@example.com' } }),
    prisma.user.findUnique({ where: { email: 'admin@example.com' } }),
    prisma.user.findUnique({ where: { email: 'cook@example.com' } }),
    prisma.user.findUnique({ where: { email: 'customer1@example.com' } }),
    prisma.user.findUnique({ where: { email: 'customer2@example.com' } }),
  ]);

  if (!owner || !admin || !cook || !customer1 || !customer2) {
    throw new Error('Failed to create one or more users');
  }

  // Create Drivers
  const [driver1, driver2] = await Promise.all([
    prisma.driver.create({
      data: {
        userId: admin.id,
        name: 'Manager Driver',
        phone: '1234567891',
        deliveryZone: 'Downtown',
        vehicleDetails: 'Toyota Prius',
        currentStatus: 'Available',
        availabilitySchedule: { monday: '9AM-5PM', tuesday: '9AM-5PM' },
        active: true,
      },
    }),
    prisma.driver.create({
      data: {
        name: 'Jane Driver',
        phone: '9876543210',
        deliveryZone: 'Uptown',
        vehicleDetails: 'Honda Civic',
        currentStatus: 'On Delivery',
        availabilitySchedule: { monday: '10AM-6PM' },
        active: true,
      },
    }),
    prisma.driver.create({
      data: {
        name: 'Inactive Driver',
        phone: '9876543211',
        deliveryZone: 'Suburb',
        vehicleDetails: 'Ford Focus',
        currentStatus: 'Offline',
        availabilitySchedule: { monday: '9AM-3PM' },
        active: false,
      },
    }),
  ]);

  // Create AppConfig
  await prisma.appConfig.create({
    data: {
      restaurantName: 'Cantina Cafe',
      operatingHours: { monday: '9AM-9PM', tuesday: '9AM-9PM', wednesday: '9AM-9PM' },
      taxRate: 0.08,
      deliveryRadius: 5.0,
      minOrderAmount: 10.00,
    },
  });

  // Create Categories
  await prisma.category.createMany({
    data: [
      { name: 'Main Course', description: 'Main dishes', order: 1 },
      { name: 'Desserts', description: 'Sweet treats', order: 2 },
      { name: 'Drinks', description: 'Beverages', order: 3 },
    ],
  });

  const [mainCourse, desserts, drinks] = await Promise.all([
    prisma.category.findUnique({ where: { name: 'Main Course' } }),
    prisma.category.findUnique({ where: { name: 'Desserts' } }),
    prisma.category.findUnique({ where: { name: 'Drinks' } }),
  ]);

  if (!mainCourse || !desserts || !drinks) {
    throw new Error('Failed to create one or more categories');
  }

  // Create Menu Items
  await prisma.menuItem.createMany({
    data: [
      { name: 'Tacos', description: 'Beef tacos with salsa', price: 8.00, categoryId: mainCourse.id, isVegetarian: false, isVegan: false, isAvailable: true },
      { name: 'Vegan Salad', description: 'Fresh salad with vegan dressing', price: 6.00, categoryId: mainCourse.id, isVegetarian: true, isVegan: true, isAvailable: true },
      { name: 'Chocolate Cake', description: 'Rich chocolate cake', price: 4.00, categoryId: desserts.id, isVegetarian: true, isVegan: false, isAvailable: true },
      { name: 'Cola', description: 'Chilled cola', price: 2.00, categoryId: drinks.id, isVegetarian: true, isVegan: true, isAvailable: true },
    ],
  });

  const [tacos, salad, cake, cola] = await Promise.all([
    prisma.menuItem.findFirst({ where: { name: 'Tacos' } }),
    prisma.menuItem.findFirst({ where: { name: 'Vegan Salad' } }),
    prisma.menuItem.findFirst({ where: { name: 'Chocolate Cake' } }),
    prisma.menuItem.findFirst({ where: { name: 'Cola' } }),
  ]);

  if (!tacos || !salad || !cake || !cola) {
    throw new Error('Failed to create one or more menu items');
  }

  // Create Orders
  const [order1, order2, order3] = await Promise.all([
    prisma.order.create({
      data: {
        orderNumber: 'ORD001',
        userId: customer1.id,
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '1234567895',
        type: OrderType.DELIVERY,
        status: OrderStatus.PENDING,
        subtotal: 16.00,
        tax: 1.28,
        total: 17.28,
        deliveryAddress: '123 Main St',
        deliveryInstructions: 'Leave at gate',
        driverId: driver1.id,
      },
    }),
    prisma.order.create({
      data: {
        orderNumber: 'ORD002',
        userId: customer1.id,
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '1234567895',
        type: OrderType.TAKEOUT,
        status: OrderStatus.PREPARING,
        subtotal: 6.00,
        tax: 0.48,
        total: 6.48,
      },
    }),
    prisma.order.create({
      data: {
        orderNumber: 'ORD003',
        userId: customer2.id,
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        customerPhone: '1234567896',
        type: OrderType.DELIVERY,
        status: OrderStatus.PAYMENT_DISPUTED,
        subtotal: 10.00,
        tax: 0.80,
        total: 10.80,
        deliveryAddress: '456 Oak St',
        driverId: driver2.id,
      },
    }),
  ]);

  // Create Order Items
  await prisma.orderItem.createMany({
    data: [
      { orderId: order1.id, menuItemId: tacos.id, quantity: 2, price: 8.00 },
      { orderId: order2.id, menuItemId: salad.id, quantity: 1, price: 6.00 },
      { orderId: order3.id, menuItemId: cake.id, quantity: 1, price: 4.00 },
      { orderId: order3.id, menuItemId: cola.id, quantity: 3, price: 2.00 },
    ],
  });

  // Create Cash Transactions
  const [transaction1, transaction2] = await Promise.all([
    prisma.cashTransaction.create({
      data: {
        orderId: order1.id,
        driverId: driver1.id,
        amount: 17.28,
        confirmed: false,
        adminVerified: false,
        discrepancyAmount: 20.00,
        discrepancyNotes: 'Customer paid $20, owed $2 change',
        paymentTimestamp: new Date('2025-07-30T10:00:00Z'),
      },
    }),
    prisma.cashTransaction.create({
      data: {
        orderId: order3.id,
        driverId: driver2.id,
        amount: 10.80,
        confirmed: true,
        adminVerified: true,
        paymentTimestamp: new Date('2025-07-29T12:00:00Z'),
      },
    }),
  ]);

  // Create Cash Summaries
  await prisma.cashSummary.createMany({
    data: [
      {
        driverId: driver1.id,
        date: new Date('2025-07-30'),
        totalAmount: 17.28,
        unconfirmedCount: 1,
        discrepancyTotal: 2.72,
      },
      {
        driverId: driver2.id,
        date: new Date('2025-07-29'),
        totalAmount: 10.80,
        unconfirmedCount: 0,
        discrepancyTotal: 0,
      },
    ],
  });

  // Create Reservations
  await prisma.reservation.createMany({
    data: [
      {
        userId: customer1.id,
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '1234567895',
        date: new Date('2025-08-01'),
        time: '18:00',
        partySize: 4,
        status: ReservationStatus.PENDING,
        notes: 'Window seat preferred',
      },
      {
        userId: customer2.id,
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        customerPhone: '1234567896',
        date: new Date('2025-08-02'),
        time: '19:00',
        partySize: 2,
        status: ReservationStatus.CONFIRMED,
        notes: 'Near entrance',
      },
    ],
  });

  // Create Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        userId: owner.id,
        action: 'ROLE_ASSIGNED',
        targetId: admin.id,
        details: { newRole: UserRole.ADMIN, assignedBy: UserRole.OWNER },
        createdAt: new Date('2025-07-30T08:00:00Z'),
      },
      {
        userId: admin.id,
        action: 'ORDER_UPDATED',
        targetId: order2.id,
        details: { status: OrderStatus.PREPARING, role: UserRole.ADMIN },
        createdAt: new Date('2025-07-30T09:00:00Z'),
      },
      {
        userId: admin.id,
        action: 'CASH_VERIFIED',
        targetId: transaction2.id,
        details: { role: UserRole.ADMIN, orderId: order3.id },
        createdAt: new Date('2025-07-29T13:00:00Z'),
      },
      {
        userId: cook.id,
        action: 'ORDER_UPDATED',
        targetId: order2.id,
        details: { status: OrderStatus.PREPARING, role: UserRole.COOK },
        createdAt: new Date('2025-07-30T09:05:00Z'),
      },
    ],
  });

  // Create Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: customer1.id,
        content: 'Your order ORD001 is pending',
        read: false,
        pushConfig: { type: 'SMS', phone: '1234567895' },
        createdAt: new Date('2025-07-30T10:00:00Z'),
      },
      {
        userId: customer2.id,
        content: 'Your order ORD003 is disputed',
        read: false,
        pushConfig: { type: 'EMAIL', email: 'jane@example.com' },
        createdAt: new Date('2025-07-29T12:30:00Z'),
      },
    ],
  });

  // Create Refresh Token
  await prisma.refreshToken.create({
    data: {
      userId: owner.id,
      token: 'sample-refresh-token-owner',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  // Create Blacklisted Token
  await prisma.blacklistedToken.create({
    data: {
      tokenHash: 'sample-blacklisted-token-hash',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    },
  });

  console.log('✅ Database seeded successfully');
}

seed()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });