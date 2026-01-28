import { Redis } from '@upstash/redis';

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('Upstash Redis credentials are not set');
}

// Create Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Helper functions for caching
export const cache = {
  // Get cached data
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get<T>(key);
      return data;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  },

  // Set cached data with optional TTL (in seconds)
  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      if (ttl) {
        await redis.setex(key, ttl, JSON.stringify(value));
      } else {
        await redis.set(key, JSON.stringify(value));
      }
      return true;
    } catch (error) {
      console.error('Redis SET error:', error);
      return false;
    }
  },

  // Delete cached data
  async delete(key: string): Promise<boolean> {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      console.error('Redis DELETE error:', error);
      return false;
    }
  },

  // Delete multiple keys matching a pattern
  async deletePattern(pattern: string): Promise<boolean> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      return true;
    } catch (error) {
      console.error('Redis DELETE PATTERN error:', error);
      return false;
    }
  },

  // Increment a counter
  async increment(key: string): Promise<number> {
    try {
      const value = await redis.incr(key);
      return value;
    } catch (error) {
      console.error('Redis INCR error:', error);
      return 0;
    }
  },

  // Set expiry on existing key
  async expire(key: string, ttl: number): Promise<boolean> {
    try {
      await redis.expire(key, ttl);
      return true;
    } catch (error) {
      console.error('Redis EXPIRE error:', error);
      return false;
    }
  },
};

// Cache key generators
export const cacheKeys = {
  user: (userId: string) => `user:${userId}`,
  subscription: (userId: string) => `subscription:${userId}`,
  usage: (userId: string, metric: string) => `usage:${userId}:${metric}`,
};
