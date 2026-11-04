import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import type { Request, Response } from 'express';

const COOKIE = 'drg_dashboard';
const AGE = 60 * 60 * 8;
const CUSTOMER = 'desertrosegin@gmail.com';
const attempts = new Map<string, { count: number; expires: number }>();

function secret() {
  const value = process.env.DASHBOARD_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error('Dashboard session secret must contain at least 32 characters');
  return value;
}
function sign(value: string) { return createHmac('sha256', secret()).update(value).digest('base64url'); }
function equal(a: string, b: string) {
  const left = Buffer.from(a); const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
function cookie(req: Request, name: string) {
  return req.headers.cookie?.split(';').map(v => v.trim()).find(v => v.startsWith(`${name}=`))?.slice(name.length + 1);
}
function setCookie(req: Request, res: Response, value: string, age: number) {
  const secure = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
  res.setHeader('Set-Cookie', `${COOKIE}=${value}; HttpOnly; SameSite=Strict; Path=/api/dashboard; Max-Age=${age}${secure ? '; Secure' : ''}`);
}
export function authenticated(req: Request) {
  try {
    const [payload, signature] = (cookie(req, COOKIE) || '').split('.');
    if (!payload || !signature || !equal(signature, sign(payload))) return false;
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (!Number.isFinite(session.expires) || session.expires < Date.now()) return false;
    return session.role === 'reviewer' || (session.role === 'customer' && process.env.DASHBOARD_CLIENT_ACCESS_ENABLED === 'true');
  } catch { return false; }
}
export function login(req: Request, res: Response) {
  // Same-origin JSON requests only; do not trust a forwarded host supplied by a client.
  if (!req.headers['content-type']?.toLowerCase().startsWith('application/json')) return res.status(415).json({ error: 'Use a JSON request.' });
  const origin = req.headers.origin;
  if (origin && new URL(origin).host !== req.headers.host) return res.status(403).json({ error: 'Request blocked.' });
  const now = Date.now();
  for (const [key, value] of attempts) if (value.expires < now) attempts.delete(key);
  const ip = process.env.VERCEL ? String(req.headers['x-forwarded-for'] || req.ip).split(',')[0] : req.ip || 'local';
  const record = attempts.get(ip) || { count: 0, expires: now + 15 * 60_000 };
  if (record.count >= 10) return res.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' });
  record.count++; attempts.set(ip, record);
  const { password, email, mode } = req.body || {};
  const reviewer = mode === 'reviewer';
  const expected = reviewer ? process.env.DASHBOARD_REVIEW_PASSWORD : process.env.DASHBOARD_CLIENT_PASSWORD;
  if (!expected || expected.length < 20 || !process.env.DASHBOARD_SESSION_SECRET || process.env.DASHBOARD_SESSION_SECRET.length < 32) {
    return res.status(503).json({ error: 'Dashboard login is not configured. Complete the private environment setup.' });
  }
  const allowed = reviewer || (process.env.DASHBOARD_CLIENT_ACCESS_ENABLED === 'true' && String(email).trim().toLowerCase() === CUSTOMER);
  // Fixed-length derived values avoid timing differences when comparing passwords.
  const salt = 'desert-rose-dashboard-login';
  const valid = typeof password === 'string' && password.length <= 256 && timingSafeEqual(scryptSync(password, salt, 32), scryptSync(expected, salt, 32));
  if (!allowed || !valid) return res.status(401).json({ error: 'Access unavailable or credentials incorrect.' });
  const payload = Buffer.from(JSON.stringify({ role: reviewer ? 'reviewer' : 'customer', expires: now + AGE * 1000, nonce: randomBytes(12).toString('hex') })).toString('base64url');
  setCookie(req, res, `${payload}.${sign(payload)}`, AGE);
  return res.json({ authenticated: true });
}
export function logout(req: Request, res: Response) { setCookie(req, res, '', 0); return res.json({ authenticated: false }); }
