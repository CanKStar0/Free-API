import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import { dash } from '@better-auth/infra';
import fs from 'fs';
import path from 'path';

// Helper to ensure env variables are loaded even in standalone Node contexts
function getEnvVar(key: string): string {
  if (process.env[key]) return process.env[key]!;
  try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed.startsWith(`${key}=`)) {
          return trimmed.replace(`${key}=`, '').trim().replace(/^["']|["']$/g, '');
        }
      }
    }
  } catch {
    // Ignore file read errors
  }
  return '';
}

const databaseUrl = getEnvVar('DATABASE_URL');
const secret = getEnvVar('BETTER_AUTH_SECRET');
const githubClientId = getEnvVar('GITHUB_CLIENT_ID');
const githubClientSecret = getEnvVar('GITHUB_CLIENT_SECRET');
const googleClientId = getEnvVar('GOOGLE_CLIENT_ID');
const googleClientSecret = getEnvVar('GOOGLE_CLIENT_SECRET');

export const auth = betterAuth({
  database: new Pool({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false,
    },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  }),
  secret: secret || undefined,
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://freeapi.website'),
  trustedOrigins: [
    'https://freeapi.website',
    'https://www.freeapi.website',
    'http://localhost:3000',
    'https://*.vercel.app',
  ],
  socialProviders: {
    github: {
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    },
    google: {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    },
  },
  plugins: [
    dash(),
  ],
});
