import { pgTable, varchar, timestamp, text, bigserial, decimal, bigint, index, uniqueIndex, json } from 'drizzle-orm/pg-core';

// Users table - synced with Clerk
export const users = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(), // Clerk user ID
  clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  clerkIdIdx: uniqueIndex('clerk_id_idx').on(table.clerkId),
  emailIdx: index('email_idx').on(table.email),
}));

// Subscriptions table
export const subscriptions = pgTable('subscriptions', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  razorpaySubscriptionId: varchar('razorpay_subscription_id', { length: 255 }).unique(),
  planType: varchar('plan_type', { length: 50 }).notNull().default('free'), // 'free', 'lite', 'pro'
  status: varchar('status', { length: 50 }).notNull().default('active'), // 'active', 'cancelled', 'expired', 'paused'
  razorpayPlanId: varchar('razorpay_plan_id', { length: 255 }),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelledAt: timestamp('cancelled_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('subscription_user_id_idx').on(table.userId),
  statusIdx: index('subscription_status_idx').on(table.status),
  razorpaySubIdIdx: uniqueIndex('razorpay_sub_id_idx').on(table.razorpaySubscriptionId),
}));

// Payments table
export const payments = pgTable('payments', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  subscriptionId: bigint('subscription_id', { mode: 'number' }).notNull().references(() => subscriptions.id, { onDelete: 'cascade' }),
  razorpayPaymentId: varchar('razorpay_payment_id', { length: 255 }).unique(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('INR').notNull(),
  status: varchar('status', { length: 50 }).notNull(), // 'captured', 'failed', 'refunded'
  paymentMethod: varchar('payment_method', { length: 50 }),
  paymentDate: timestamp('payment_date'),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  subscriptionIdIdx: index('payment_subscription_id_idx').on(table.subscriptionId),
  paymentDateIdx: index('payment_date_idx').on(table.paymentDate),
  razorpayPaymentIdIdx: uniqueIndex('razorpay_payment_id_idx').on(table.razorpayPaymentId),
}));

// Usage metrics table - for tracking plan limits
export const usageMetrics = pgTable('usage_metrics', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  metricType: varchar('metric_type', { length: 50 }).notNull(), // 'projects', 'storage', 'api_calls'
  currentValue: bigint('current_value', { mode: 'number' }).default(0).notNull(),
  limitValue: bigint('limit_value', { mode: 'number' }),
  resetDate: timestamp('reset_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userMetricIdx: index('usage_user_metric_idx').on(table.userId, table.metricType),
}));

// Audit logs table
export const auditLogs = pgTable('audit_logs', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: varchar('user_id', { length: 255 }),
  action: varchar('action', { length: 100 }).notNull(),
  resourceType: varchar('resource_type', { length: 50 }),
  resourceId: varchar('resource_id', { length: 255 }),
  details: json('details'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('audit_user_id_idx').on(table.userId),
  createdAtIdx: index('audit_created_at_idx').on(table.createdAt),
  actionIdx: index('audit_action_idx').on(table.action),
}));

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

export type UsageMetric = typeof usageMetrics.$inferSelect;
export type NewUsageMetric = typeof usageMetrics.$inferInsert;

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
