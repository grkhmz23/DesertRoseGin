import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Request, Response } from 'express';
import { authenticated, login } from '../server/dashboard/auth';
import { dateWindow, flatten } from '../server/dashboard/reports';
import handler from '../server/dashboard/handler';
import { JWT } from 'google-auth-library';
import { reports } from '../server/dashboard/reports';

process.env.DASHBOARD_SESSION_SECRET = 'test-session-secret-with-at-least-32-characters';
process.env.DASHBOARD_REVIEW_PASSWORD = 'test-review-password-very-long';
process.env.DASHBOARD_CLIENT_PASSWORD = 'test-customer-password-very-long';
process.env.DASHBOARD_CLIENT_ACCESS_ENABLED = 'false';
function request(body = {}, cookie = '') {
  return { body, headers: { 'content-type': 'application/json', host: 'localhost', cookie }, ip: '127.0.0.1', method: 'POST', query: {} } as unknown as Request;
}
function response() {
  const result = { code: 200, body: {} as any, headers: {} as Record<string, string> };
  const res = { status(code: number) { result.code = code; return res; }, json(body: unknown) { result.body = body; return res; }, setHeader(key: string, value: string) { result.headers[key] = value; return res; } } as unknown as Response;
  return { res, result };
}
test('review login issues signed session; tampered and expired sessions are refused', () => {
  const { res, result } = response();
  login(request({ mode: 'reviewer', password: process.env.DASHBOARD_REVIEW_PASSWORD }), res);
  assert.equal(result.code, 200);
  const cookie = result.headers['Set-Cookie'].split(';')[0];
  assert.ok(result.headers['Set-Cookie'].includes('HttpOnly'));
  assert.equal(authenticated(request({}, cookie)), true);
  assert.equal(authenticated(request({}, cookie + 'tampered')), false);
  assert.equal(authenticated(request()), false);
  const original = Date.now;
  try { Date.now = () => original() + 9 * 60 * 60_000; assert.equal(authenticated(request({}, cookie)), false); }
  finally { Date.now = original; }
});
test('customer access is refused before handover even with the correct password', () => {
  const { res, result } = response(); login(request({ mode: 'customer', email: 'desertrosegin@gmail.com', password: process.env.DASHBOARD_CLIENT_PASSWORD }), res);
  assert.equal(result.code, 401); assert.equal(result.headers['Set-Cookie'], undefined);
});
test('origin and non-JSON requests are rejected', () => {
  const req = request(); req.headers.origin = 'https://other.example';
  const first = response(); login(req, first.res); assert.equal(first.result.code, 403);
  delete req.headers['content-type']; const second = response(); login(req, second.res); assert.equal(second.result.code, 415);
});
test('anonymous report endpoint returns 401 and never caches private data', async () => {
  const req = request(); req.method = 'GET'; req.query = { action: 'reports' };
  const { res, result } = response(); await handler(req, res);
  assert.equal(result.code, 401); assert.equal(result.headers['Cache-Control'], 'private, no-store');
});
test('customer sessions require enabled access and become invalid when disabled', () => {
  process.env.DASHBOARD_CLIENT_ACCESS_ENABLED = 'true';
  try {
    const denied = response(); login(request({ mode: 'customer', email: 'someone@example.com', password: process.env.DASHBOARD_CLIENT_PASSWORD }), denied.res); assert.equal(denied.result.code, 401);
    const { res, result } = response(); login(request({ mode: 'customer', email: 'desertrosegin@gmail.com', password: process.env.DASHBOARD_CLIENT_PASSWORD }), res);
    assert.equal(result.code, 200); const req = request({}, result.headers['Set-Cookie'].split(';')[0]); assert.equal(authenticated(req), true);
    process.env.DASHBOARD_CLIENT_ACCESS_ENABLED = 'false'; assert.equal(authenticated(req), false);
  } finally { process.env.DASHBOARD_CLIENT_ACCESS_ENABLED = 'false'; }
});
test('report dates include exactly requested days and an adjacent equal previous period', () => {
  for (const days of [7,28,90]) {
    const r = dateWindow(days); const diff = (a: string, b: string) => (Date.parse(a) - Date.parse(b)) / 86400000;
    assert.equal(diff(r.endDate, r.startDate), days-1); assert.equal(diff(r.previousEnd, r.previousStart), days-1); assert.equal(diff(r.startDate, r.previousEnd), 1);
  }
});
test('GA4 report normalizer preserves dimensions and converts metric values', () => {
  assert.deepEqual(flatten({ dimensionHeaders: [{ name: 'country' }], metricHeaders: [{ name: 'activeUsers' }], rows: [{ dimensionValues: [{ value: 'Switzerland' }], metricValues: [{ value: '42' }] }] }), [{ country: 'Switzerland', activeUsers: 42 }]);
  assert.deepEqual(flatten({}), []);
});
test('reports request read-only data with fixed properties and preserve one-source failures', async () => {
  const original = JWT.prototype.request;
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'test@example.com';
  process.env.GOOGLE_PRIVATE_KEY = 'test-key';
  process.env.GA4_PROPERTY_ID = '532207662';
  process.env.SEARCH_CONSOLE_SITE_URL = 'sc-domain:thedesertrosegin.com';
  let calls = 0;
  // Stub only the Google transport: no real credentials or network calls.
  JWT.prototype.request = (async ({ url, data }: { url: string; data: any }) => {
    calls++;
    if (url.includes('analyticsdata')) {
      assert.ok(url.includes('/properties/532207662:batchRunReports'));
      assert.ok(data.requests.length <= 5);
      return { data: { reports: data.requests.map(() => ({ metricHeaders: [{ name: 'activeUsers' }], rows: [{ metricValues: [{ value: '12' }] }] })) } };
    }
    assert.ok(url.includes('sc-domain%3Athedesertrosegin.com'));
    assert.equal(data.dataState, 'final');
    throw { response: { status: 403 } };
  }) as typeof original;
  try {
    const result = await reports(7) as any;
    assert.equal(result.analytics.data.summary.activeUsers, 12);
    assert.match(result.search.error, /Access denied/);
    const before = calls; await reports(7); assert.ok(calls > before, 'partial errors must not be cached');
  } finally { JWT.prototype.request = original; }
});
