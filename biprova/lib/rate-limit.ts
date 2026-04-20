import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';

const hasRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

const redis = hasRedis
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

// Hesap kilitleme sabitleri
const LOCKOUT_MAX_ATTEMPTS = 5;
const LOCKOUT_WINDOW_SECONDS = 15 * 60; // 15 dakika

function lockoutKey(email: string): string {
  return `lockout:${email.toLowerCase()}`;
}

// Production'da Redis yoksa tüm rate-limited aksiyonları reddet (güvenli default)
const noopLimiter = {
  limit: async () => ({
    success: process.env.NODE_ENV !== 'production',
  }),
};

export async function recordFailedLogin(email: string): Promise<{ locked: boolean; attemptsLeft: number }> {
  if (!redis) return { locked: false, attemptsLeft: LOCKOUT_MAX_ATTEMPTS };
  const key = lockoutKey(email);
  const attempts = await redis.incr(key);

  // İlk denemede TTL ayarla
  if (attempts === 1) {
    await redis.expire(key, LOCKOUT_WINDOW_SECONDS);
  }

  const locked = attempts >= LOCKOUT_MAX_ATTEMPTS;
  const attemptsLeft = Math.max(0, LOCKOUT_MAX_ATTEMPTS - attempts);
  return { locked, attemptsLeft };
}

export async function checkAccountLocked(email: string): Promise<{ locked: boolean; ttl: number }> {
  if (!redis) return { locked: false, ttl: 0 };
  const key = lockoutKey(email);
  const attempts = await redis.get<number>(key);

  if (!attempts || attempts < LOCKOUT_MAX_ATTEMPTS) {
    return { locked: false, ttl: 0 };
  }

  const ttl = await redis.ttl(key);
  return { locked: true, ttl: Math.max(0, ttl) };
}

export async function clearFailedLogins(email: string): Promise<void> {
  if (!redis) return;
  await redis.del(lockoutKey(email));
}

// login: IP başına 10 saniyede 5 deneme
export const loginLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '10 s'), prefix: 'rl:login' })
  : noopLimiter;

// signup: IP başına 1 dakikada 3 deneme
export const signupLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '1 m'), prefix: 'rl:signup' })
  : noopLimiter;

// email check: IP başına 1 dakikada 10 deneme
export const emailCheckLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '1 m'), prefix: 'rl:email' })
  : noopLimiter;

// mesaj gönderme: kullanıcı başına 1 dakikada 30 mesaj
export const messageLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, '1 m'), prefix: 'rl:message' })
  : noopLimiter;

// gönderi oluşturma: kullanıcı başına 1 dakikada 5 gönderi
export const postLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '1 m'), prefix: 'rl:post' })
  : noopLimiter;

// waitlist: IP başına 1 saatte 3 kayıt
export const waitlistLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '1 h'), prefix: 'rl:waitlist' })
  : noopLimiter;

export async function getClientIp(): Promise<string> {
  const headerStore = await headers();
  return (
    headerStore.get('x-forwarded-for')?.split(',')[0].trim() ??
    headerStore.get('x-real-ip') ??
    'anonymous'
  );
}
