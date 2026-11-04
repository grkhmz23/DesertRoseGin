import { JWT } from 'google-auth-library';

type Row = { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] };
type Report = { dimensionHeaders?: { name: string }[]; metricHeaders?: { name: string }[]; rows?: Row[] };
const cache = new Map<number, { expires: number; data: unknown }>();

export function flatten(report: Report = {}) {
  return (report.rows || []).map(row => Object.fromEntries([
    ...(report.dimensionHeaders || []).map((h, i) => [h.name, row.dimensionValues?.[i]?.value || '']),
    ...(report.metricHeaders || []).map((h, i) => [h.name, Number(row.metricValues?.[i]?.value || 0)]),
  ]));
}
export function dateWindow(days: number) {
  const end = new Date(); end.setUTCDate(end.getUTCDate() - 1);
  const start = new Date(end); start.setUTCDate(start.getUTCDate() - days + 1);
  const priorEnd = new Date(start); priorEnd.setUTCDate(priorEnd.getUTCDate() - 1);
  const priorStart = new Date(priorEnd); priorStart.setUTCDate(priorStart.getUTCDate() - days + 1);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return { startDate: iso(start), endDate: iso(end), previousStart: iso(priorStart), previousEnd: iso(priorEnd) };
}
export function sourceError(error: unknown) {
  const failure = error as { code?: string; message?: string; response?: { status?: number; data?: { error?: string | { status?: string }; error_description?: string } } };
  const status = failure?.response?.status;
  const provider = failure?.response?.data;
  const text = `${failure?.message || ''} ${provider?.error_description || ''}`;
  if (failure?.message === 'Missing GA4 property ID') return 'GA4_PROPERTY_ID is missing or invalid. Set it to 532207662 in the Production environment and redeploy.';
  if (failure?.message === 'Missing Search Console property') return 'SEARCH_CONSOLE_SITE_URL is missing. Set it to sc-domain:thedesertrosegin.com in Production and redeploy.';
  if (failure?.code?.startsWith('ERR_OSSL') || /private.?key|no key or keyfile|PEM|decoder|secretOrPrivateKey/i.test(text)) return 'GOOGLE_PRIVATE_KEY could not be read. Copy the complete private_key value from the downloaded JSON, including BEGIN PRIVATE KEY and END PRIVATE KEY, without the JSON quotes. Save in Production and redeploy.';
  if (/invalid_grant|invalid jwt|invalid signature|account not found|invalid_client/i.test(`${typeof provider?.error === 'string' ? provider.error : ''} ${text}`)) return 'Google rejected the service account credentials. Check that GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY come from the same active JSON key.';
  if (status === 403) return 'Access denied. Check API activation and the service account permissions for this property.';
  if (status === 429) return 'Google reporting quota reached. Retry later.';
  if (status === 401) return 'Google authentication failed. Check the service account email and its active private key.';
  if (status === 400) return 'Google rejected the request (HTTP 400). Check the property ID and report configuration.';
  if (status === 404) return 'The Google property was not found. Check its configured identifier and service account access.';
  if (/timeout|ETIMEDOUT|ECONNRESET/i.test(`${failure?.code || ''} ${text}`)) return 'Google did not respond in time. Please refresh to retry.';
  return 'Unable to read this source. Check credentials, property configuration, and API activation.';
}
export async function reports(days: number) {
  const hit = cache.get(days); if (hit && hit.expires > Date.now()) return hit.data;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!email || !key) throw new Error('Google credentials have not been configured.');
  const client = new JWT({ email, key, scopes: ['https://www.googleapis.com/auth/analytics.readonly', 'https://www.googleapis.com/auth/webmasters.readonly'] });
  const dates = dateWindow(days);
  const property = process.env.GA4_PROPERTY_ID;
  const site = process.env.SEARCH_CONSOLE_SITE_URL;
  const range = [{ startDate: dates.startDate, endDate: dates.endDate }];
  const totals = ['activeUsers', 'sessions', 'screenPageViews', 'eventCount'];
  const report = (dimensions: string[], metrics: string[], extra = {}) => ({ dateRanges: range, dimensions: dimensions.map(name => ({ name })), metrics: metrics.map(name => ({ name })), limit: '20', ...extra });
  const ga = async () => {
    if (!property || !/^\d+$/.test(property)) throw new Error('Missing GA4 property ID');
    const url = `https://analyticsdata.googleapis.com/v1beta/properties/${property}:batchRunReports`;
    const requests = [
      report([], totals),
      report([], totals, { dateRanges: [{ startDate: dates.previousStart, endDate: dates.previousEnd }] }),
      report(['date'], ['activeUsers', 'screenPageViews'], { limit: '100', orderBys: [{ dimension: { dimensionName: 'date' } }] }),
      report(['country'], ['activeUsers'], { orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }] }),
      report(['pagePath'], ['screenPageViews'], { orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }] }),
      report(['sessionDefaultChannelGroup'], ['sessions'], { orderBys: [{ metric: { metricName: 'sessions' }, desc: true }] }),
      report(['deviceCategory'], ['activeUsers']),
      report(['eventName'], ['eventCount'], { limit: '100', orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }] }),
    ];
    const responses = await Promise.all([requests.slice(0, 5), requests.slice(5)].map(async requests => {
      const r = await client.request<{ reports: Report[] }>({ url, method: 'POST', data: { requests }, timeout: 15000 }); return r.data.reports;
    }));
    const [summary, previous, trend, countries, pages, channels, devices, events] = responses.flat().map(flatten);
    return { summary: summary[0] || {}, previous: previous[0] || {}, trend, countries, pages, channels, devices, events };
  };
  const seo = async () => {
    if (!site) throw new Error('Missing Search Console property');
    const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`;
    const read = async (dimensions: string[], previous = false) => {
      const r = await client.request<{ rows?: unknown[] }>({ url, method: 'POST', timeout: 15000, data: {
        startDate: previous ? dates.previousStart : dates.startDate,
        endDate: previous ? dates.previousEnd : dates.endDate, dimensions, rowLimit: 20, dataState: 'final',
      } }); return r.data.rows || [];
    };
    const [summary, previous, queries, pages, countries] = await Promise.all([read([]), read([], true), read(['query']), read(['page']), read(['country'])]);
    return { summary: summary[0] || {}, previous: previous[0] || {}, queries, pages, countries };
  };
  const [analytics, search] = await Promise.allSettled([ga(), seo()]);
  const data = { dates, generatedAt: new Date().toISOString(), analytics: analytics.status === 'fulfilled' ? { data: analytics.value } : { error: sourceError(analytics.reason) }, search: search.status === 'fulfilled' ? { data: search.value } : { error: sourceError(search.reason) } };
  // Only successful source reads are cached, preventing transient setup errors from sticking.
  if (analytics.status === 'fulfilled' && search.status === 'fulfilled') cache.set(days, { expires: Date.now() + 5 * 60_000, data });
  return data;
}
