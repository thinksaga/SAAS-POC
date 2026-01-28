import 'dotenv/config';
import { db } from './index';
import { users, subscriptions, usageMetrics } from './schema';

/**
 * Seed database with initial data
 */
async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // You can add initial data here if needed
    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log('✅ Seeding complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
