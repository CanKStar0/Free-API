const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:%22WxR%5D%22G%3EQ5yxg%5DC@db.gdowppsldfjloqvcyzpi.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

const schemaSQL = `
-- Better Auth Core Tables
CREATE TABLE IF NOT EXISTS "user" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  "emailVerified" BOOLEAN NOT NULL DEFAULT FALSE,
  image TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "session" (
  id TEXT PRIMARY KEY,
  "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  token TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "account" (
  id TEXT PRIMARY KEY,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" TIMESTAMP WITH TIME ZONE,
  "refreshTokenExpiresAt" TIMESTAMP WITH TIME ZONE,
  "scope" TEXT,
  "password" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "verification" (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Phase 5 Developer Ecosystem Tables
CREATE TABLE IF NOT EXISTS "user_bookmarks" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  "apiSlug" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE("userId", "apiSlug")
);

CREATE TABLE IF NOT EXISTS "user_stacks" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  "apiSlugs" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "isPublic" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_session_userId ON "session"("userId");
CREATE INDEX IF NOT EXISTS idx_account_userId ON "account"("userId");
CREATE INDEX IF NOT EXISTS idx_bookmarks_userId ON "user_bookmarks"("userId");
CREATE INDEX IF NOT EXISTS idx_stacks_userId ON "user_stacks"("userId");
CREATE INDEX IF NOT EXISTS idx_stacks_slug ON "user_stacks"(slug);
`;

async function setup() {
  try {
    console.log('Applying database schema to Supabase PostgreSQL...');
    await pool.query(schemaSQL);
    console.log('✅ ALL DATABASE TABLES & INDEXES CREATED SUCCESSFULLY!');

    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);
    console.log('Created Public Tables:', tables.rows.map(r => r.table_name));
    await pool.end();
  } catch (err) {
    console.error('Schema setup error:', err);
    process.exit(1);
  }
}

setup();
