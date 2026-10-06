import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const API_ROOT = path.resolve(HERE, '..');

const isProd = process.env.NODE_ENV === 'production';

// 🏫 TODO W13-SECRET (CP52) — Fail Fast
if (isProd && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required in production environment');
}

export const config = {
  env: process.env.NODE_ENV ?? 'development',
  isProd,
  port: Number(process.env.PORT ?? 3001),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  dbFile: process.env.DB_FILE ?? path.join(API_ROOT, 'data', 'campus.db'),
  schemaFile: path.join(API_ROOT, 'data', 'schema.sql'),
  staticDir: process.env.STATIC_DIR ?? path.join(API_ROOT, '..', 'frontend', 'dist'),

  jwtSecret: process.env.JWT_SECRET || 'dev-only-secret-do-not-use-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '2h',
};