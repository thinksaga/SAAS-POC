// Run this script to manually set a user to Lite plan
// Usage: tsx scripts/set-user-plan.ts <clerk-user-id> <plan>

import { db } from '../lib/db';
import { subscriptions } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

const userId = process.argv[2];
const plan = process.argv[3] || 'lite';

if (!userId) {
  console.error('Usage: tsx scripts/set-user-plan.ts <clerk-user-id> <plan>');
  console.error('Example: tsx scripts/set-user-plan.ts user_abc123 lite');
  process.exit(1);
}

async function setUserPlan() {
  try {
    // Delete existing subscriptions
    await db.delete(subscriptions).where(eq(subscriptions.userId, userId));

    // Insert new subscription
    await db.insert(subscriptions).values({
      userId: userId,
      planType: plan,
      status: 'active',
      startDate: new Date(),
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    console.log(`✅ User ${userId} is now on ${plan} plan`);
    console.log('🔄 Redis cache will be refreshed on next dashboard visit');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

setUserPlan();
