import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create the connection
const sql = neon(process.env.DATABASE_URL);

// Create the drizzle instance
export const db = drizzle(sql, { schema });

// Export the sql instance for raw queries if needed
export { sql };
