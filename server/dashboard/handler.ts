import type { Request, Response } from 'express';
import { authenticated, login, logout } from './auth.js';
import { reports } from './reports.js';

export default async function handler(req: Request, res: Response) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  try {
    const action = String(req.query.action || 'session');
    if (action === 'login' && req.method === 'POST') return login(req, res);
    if (action === 'logout' && req.method === 'POST') return logout(req, res);
    if (action === 'session' && req.method === 'GET') return res.json({ authenticated: authenticated(req), clientEnabled: process.env.DASHBOARD_CLIENT_ACCESS_ENABLED === 'true' });
    if (action !== 'reports' || req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });
    if (!authenticated(req)) return res.status(401).json({ error: 'Please sign in.' });
    const days = Number(req.query.days || 28);
    if (![7, 28, 90].includes(days)) return res.status(400).json({ error: 'Choose 7, 28, or 90 days.' });
    return res.json(await reports(days));
  } catch {
    return res.status(503).json({ error: 'Dashboard data is unavailable. Check the server environment configuration.' });
  }
}
