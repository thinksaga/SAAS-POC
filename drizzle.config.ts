import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_XdQsr7Tx2vZY@ep-snowy-math-a19iuhy2-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  },
  verbose: true,
  strict: true,
});
