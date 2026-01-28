import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from './db';
import { subscriptions } from './db/schema';
import { eq, desc } from 'drizzle-orm';
import { cache as redisCache, cacheKeys } from './redis';
import { cache as reactCache } from 'react';

export type UserPlan = 'free' | 'lite' | 'pro';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'paused';

export interface UserSubscription {
  plan: UserPlan;
  status?: SubscriptionStatus;
  subscriptionId?: string;
  startDate?: number;
  endDate?: number;
}

/**
 * Get subscription from database - optimized with parallel queries
 */
const getSubscriptionFromDB = reactCache(async (userId: string): Promise<UserSubscription> => {
  try {
    // Check Redis cache first
    const cacheKey = cacheKeys.subscription(userId);
    const cached = await redisCache.get<UserSubscription>(cacheKey);
    
    if (cached) {
      return cached;
    }

    // Fetch subscription directly - user creation handled by webhook/first login
    const subscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(desc(subscriptions.createdAt))
      .limit(1);

    if (subscription.length === 0) {
      const result: UserSubscription = { plan: 'free' };
      await redisCache.set(cacheKey, result, 300);
      return result;
    }

    const sub = subscription[0];
    const result: UserSubscription = {
      plan: sub.planType as UserPlan,
      status: sub.status as SubscriptionStatus,
      subscriptionId: sub.razorpaySubscriptionId || undefined,
      startDate: sub.startDate ? sub.startDate.getTime() : undefined,
      endDate: sub.endDate ? sub.endDate.getTime() : undefined,
    };

    // Cache for 5 minutes
    await redisCache.set(cacheKey, result, 300);
    
    return result;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return { plan: 'free' };
  }
});

/**
 * Get the current user's subscription details - cached and optimized
 */
export const getUserSubscription = reactCache(async (): Promise<UserSubscription> => {
  const user = await currentUser();
  
  if (!user) {
    return { plan: 'free' };
  }

  return getSubscriptionFromDB(user.id);
});

/**
 * Check if user has an active subscription
 */
export async function hasActiveSubscription(): Promise<boolean> {
  const subscription = await getUserSubscription();
  return subscription.status === 'active' && subscription.plan !== 'free';
}

/**
 * Check if user has a specific plan
 */
export async function hasPlan(requiredPlan: UserPlan): Promise<boolean> {
  const subscription = await getUserSubscription();
  
  // Define plan hierarchy
  const planHierarchy: Record<UserPlan, number> = {
    free: 0,
    lite: 1,
    pro: 2,
  };
  
  return planHierarchy[subscription.plan] >= planHierarchy[requiredPlan];
}

/**
 * Require a specific plan or redirect to pricing page
 */
export async function requirePlan(requiredPlan: UserPlan, redirectPath = '/pricing') {
  const hasAccess = await hasPlan(requiredPlan);
  
  if (!hasAccess) {
    redirect(redirectPath);
  }
}

/**
 * Require authentication or redirect to sign in
 */
export async function requireAuth(redirectPath = '/sign-in') {
  const { userId } = await auth();
  
  if (!userId) {
    redirect(redirectPath);
  }
  
  return userId;
}

/**
 * Check if user has a specific feature based on their plan
 */
export async function hasFeature(feature: string): Promise<boolean> {
  const subscription = await getUserSubscription();
  
  // Define features per plan
  const planFeatures: Record<UserPlan, string[]> = {
    free: [
      'basic_analytics',
      'community_support',
      'limited_projects',
    ],
    lite: [
      'basic_analytics',
      'community_support',
      'limited_projects',
      'advanced_analytics',
      'priority_support',
      'unlimited_projects',
    ],
    pro: [
      'basic_analytics',
      'community_support',
      'limited_projects',
      'advanced_analytics',
      'priority_support',
      'unlimited_projects',
      'api_access',
      'custom_integrations',
      'dedicated_support',
      'white_label',
    ],
  };
  
  return planFeatures[subscription.plan]?.includes(feature) ?? false;
}
