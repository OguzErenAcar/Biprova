import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// login: IP başına 10 saniyede 5 deneme
export const loginLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 s'),
  prefix: 'rl:login',
});

// signup: IP başına 1 dakikada 3 deneme
export const signupLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 m'),
  prefix: 'rl:signup',
});

// email check: IP başına 1 dakikada 10 deneme
export const emailCheckLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  prefix: 'rl:email',
});

export async function getClientIp(): Promise<string> {
  const headerStore = await headers();
  return (
    headerStore.get('x-forwarded-for')?.split(',')[0].trim() ??
    headerStore.get('x-real-ip') ??
    'anonymous'
  );
}
