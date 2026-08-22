import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
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

const isProd = process.env.NODE_ENV === 'production' || !!process.env.RAILWAY_STATIC_URL;

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
  baseURL: isProd ? 'https://freeapi.website' : (process.env.BETTER_AUTH_URL || 'http://localhost:3000'),
  trustedOrigins: [
    'https://freeapi.website',
    'https://www.freeapi.website',
    'http://localhost:3000',
    'https://*.railway.app',
    'https://*.vercel.app',
  ],
  advanced: {
    useSecureCookies: isProd,
    crossSubDomainCookies: {
      enabled: false,
    },
  },
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
});
