import { db } from './db';
import { users, subscriptions, payments, usageMetrics, auditLogs } from './db/schema';
import { eq, and } from 'drizzle-orm';
import { createClerkClient } from '@clerk/nextjs/server';
import { cache, cacheKeys } from './redis';

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

/**
 * Sync user from Clerk to database
 */
export async function syncUserToDatabase(clerkUserId: string) {
  try {
    const user = await clerkClient.users.getUser(clerkUserId);
    
    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkUserId))
      .limit(1);

    if (existingUser.length === 0) {
      // Create new user
      await db.insert(users).values({
        id: clerkUserId,
        clerkId: clerkUserId,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
      });
      
      // Initialize free subscription
      await db.insert(subscriptions).values({
        userId: clerkUserId,
        planType: 'free',
        status: 'active',
      });
    } else {
      // Update existing user
      await db
        .update(users)
        .set({
          email: user.emailAddresses[0]?.emailAddress || '',
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
          updatedAt: new Date(),
        })
        .where(eq(users.clerkId, clerkUserId));
    }

    // Clear cache
    await cache.delete(cacheKeys.subscription(clerkUserId));
    
    return true;
  } catch (error) {
    console.error('Error syncing user to database:', error);
    return false;
  }
}

/**
 * Create or update subscription in database
 */
export async function upsertSubscription(data: {
  userId: string;
  razorpaySubscriptionId: string;
  planType: 'free' | 'lite' | 'pro';
  status: 'active' | 'cancelled' | 'expired' | 'paused';
  razorpayPlanId?: string;
  startDate?: Date;
  endDate?: Date;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
}) {
  try {
    // Check if subscription exists
    const existing = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.razorpaySubscriptionId, data.razorpaySubscriptionId))
      .limit(1);

    if (existing.length > 0) {
      // Update existing subscription
      await db
        .update(subscriptions)
        .set({
          planType: data.planType,
          status: data.status,
          razorpayPlanId: data.razorpayPlanId,
          startDate: data.startDate,
          endDate: data.endDate,
          currentPeriodStart: data.currentPeriodStart,
          currentPeriodEnd: data.currentPeriodEnd,
          cancelledAt: data.status === 'cancelled' ? new Date() : undefined,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.razorpaySubscriptionId, data.razorpaySubscriptionId));
    } else {
      // Create new subscription
      await db.insert(subscriptions).values({
        userId: data.userId,
        razorpaySubscriptionId: data.razorpaySubscriptionId,
        planType: data.planType,
        status: data.status,
        razorpayPlanId: data.razorpayPlanId,
        startDate: data.startDate,
        endDate: data.endDate,
        currentPeriodStart: data.currentPeriodStart,
        currentPeriodEnd: data.currentPeriodEnd,
      });
    }

    // Also update Clerk metadata for backward compatibility
    await clerkClient.users.updateUserMetadata(data.userId, {
      privateMetadata: {
        plan: data.planType,
        subscription_status: data.status,
        razorpay_subscription_id: data.razorpaySubscriptionId,
        subscription_start: data.startDate?.getTime(),
        subscription_end: data.endDate?.getTime(),
      },
    });

    // Clear cache
    await cache.delete(cacheKeys.subscription(data.userId));
    
    return true;
  } catch (error) {
    console.error('Error upserting subscription:', error);
    return false;
  }
}

/**
 * Record a payment
 */
export async function recordPayment(data: {
  razorpaySubscriptionId: string;
  razorpayPaymentId: string;
  amount: string;
  currency: string;
  status: string;
  paymentMethod?: string;
  paymentDate?: Date;
  metadata?: any;
}) {
  try {
    // Get subscription ID
    const subscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.razorpaySubscriptionId, data.razorpaySubscriptionId))
      .limit(1);

    if (subscription.length === 0) {
      console.error('Subscription not found for payment');
      return false;
    }

    // Insert payment record
    await db.insert(payments).values({
      subscriptionId: subscription[0].id,
      razorpayPaymentId: data.razorpayPaymentId,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
      paymentMethod: data.paymentMethod,
      paymentDate: data.paymentDate || new Date(),
      metadata: data.metadata,
    });

    // Update Clerk metadata with last payment info
    await clerkClient.users.updateUserMetadata(subscription[0].userId, {
      privateMetadata: {
        last_payment_id: data.razorpayPaymentId,
        last_payment_date: (data.paymentDate || new Date()).getTime(),
      },
    });

    return true;
  } catch (error) {
    console.error('Error recording payment:', error);
    return false;
  }
}

/**
 * Log an audit event
 */
export async function logAudit(data: {
  userId?: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    await db.insert(auditLogs).values(data);
    return true;
  } catch (error) {
    console.error('Error logging audit:', error);
    return false;
  }
}

/**
 * Get or initialize usage metrics for a user
 */
export async function getUsageMetric(userId: string, metricType: string) {
  try {
    const metric = await db
      .select()
      .from(usageMetrics)
      .where(
        and(
          eq(usageMetrics.userId, userId),
          eq(usageMetrics.metricType, metricType)
        )
      )
      .limit(1);

    if (metric.length === 0) {
      // Initialize metric
      const newMetric = await db
        .insert(usageMetrics)
        .values({
          userId,
          metricType,
          currentValue: 0,
        })
        .returning();
      
      return newMetric[0];
    }

    return metric[0];
  } catch (error) {
    console.error('Error getting usage metric:', error);
    return null;
  }
}

/**
 * Increment usage metric
 */
export async function incrementUsage(userId: string, metricType: string, increment = 1) {
  try {
    const metric = await getUsageMetric(userId, metricType);
    
    if (!metric) {
      return false;
    }

    await db
      .update(usageMetrics)
      .set({
        currentValue: (metric.currentValue || 0) + increment,
        updatedAt: new Date(),
      })
      .where(eq(usageMetrics.id, metric.id));

    return true;
  } catch (error) {
    console.error('Error incrementing usage:', error);
    return false;
  }
}
