import type { H3Event } from 'h3';
import { and, eq, gt, lt } from 'drizzle-orm';
import { loginAttempts } from '../database/schema';
import { useDb } from './drizzle';

const LIMITS = {
  login: { max: 8, windowMs: 15 * 60 * 1000 },
  submit: { max: 10, windowMs: 60 * 60 * 1000 },
} as const;

export type RateLimitKind = keyof typeof LIMITS;

export function requestIp(event: H3Event) {
  return getRequestIP(event, { xForwardedFor: true }) || 'unknown';
}

async function recentAttempts(ip: string, kind: RateLimitKind) {
  const since = Date.now() - LIMITS[kind].windowMs;
  const rows = await useDb()
    .select({ id: loginAttempts.id })
    .from(loginAttempts)
    .where(and(
      eq(loginAttempts.ip, ip),
      eq(loginAttempts.kind, kind),
      gt(loginAttempts.createdAt, since),
    ));
  return rows.length;
}

export async function isRateLimited(event: H3Event, kind: RateLimitKind) {
  const count = await recentAttempts(requestIp(event), kind);
  return count >= LIMITS[kind].max;
}

export async function recordAttempt(event: H3Event, kind: RateLimitKind) {
  const now = Date.now();
  const db = useDb();
  await db.delete(loginAttempts).where(lt(loginAttempts.createdAt, now - 24 * 60 * 60 * 1000));
  await db.insert(loginAttempts).values({
    ip: requestIp(event),
    kind,
    createdAt: now,
  });
}

export async function clearAttempts(event: H3Event, kind: RateLimitKind) {
  await useDb().delete(loginAttempts).where(and(
    eq(loginAttempts.ip, requestIp(event)),
    eq(loginAttempts.kind, kind),
  ));
}
