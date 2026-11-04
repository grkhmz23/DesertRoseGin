import { useEffect, useState, type FormEvent } from 'react';
import { ArrowUpRight, BarChart3, Globe2, MousePointer2, Search, ShieldCheck, LogOut, RefreshCw } from 'lucide-react';

type DataRow = Record<string, string | number>;
type SearchRow = { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number };
type Analytics = { summary: DataRow; previous: DataRow; trend: DataRow[]; countries: DataRow[]; pages: DataRow[]; channels: DataRow[]; devices: DataRow[]; events: DataRow[] };
type SearchData = { summary: Partial<SearchRow>; previous: Partial<SearchRow>; queries: SearchRow[]; pages: SearchRow[]; countries: SearchRow[] };
type Result = { dates: { startDate: string; endDate: string }; generatedAt: string; analytics: { data?: Analytics; error?: string }; search: { data?: SearchData; error?: string } };
const number = (n: unknown) => Number(n || 0).toLocaleString('en-GB', { maximumFractionDigits: 1 });
async function api(action: string, options?: RequestInit) {
  const response = await fetch(`/api/dashboard?action=${action}`, { credentials: 'same-origin', ...options });
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error(`Dashboard service is unavailable (HTTP ${response.status}). Please check the deployment’s function logs.`);
  }
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Request failed.');
  return data;
}
function Metric({ label, value, previous, suffix = '' }: { label: string; value: number; previous?: number; suffix?: string }) {
  const change = previous ? ((value - previous) / previous) * 100 : null;
  return <article className="metric"><span>{label}</span><strong>{number(value)}{suffix}</strong><small>{change === null ? 'No previous-period baseline' : `${change >= 0 ? '+' : ''}${number(change)}% vs previous period`}</small></article>;
}
function Table({ title, rows, label, metric, metricLabel }: { title: string; rows: DataRow[]; label: string; metric: string; metricLabel: string }) {
  const max = Math.max(1, ...rows.map(r => Number(r[metric])));
  return <section className="panel"><h2>{title}</h2><div className="table-head"><span>Name</span><span>{metricLabel}</span></div>{rows.length === 0 ? <p className="empty">No data reported for this period.</p> : rows.map((r, i) => <div className="data-row" key={i}><div><span title={String(r[label])}>{String(r[label] || '(not set)')}</span><div className="bar"><i style={{ width: `${Number(r[metric]) / max * 100}%` }} /></div></div><b>{number(r[metric])}</b></div>)}</section>;
}
function SearchTable({ title, rows }: { title: string; rows: SearchRow[] }) {
  return <section className="panel"><h2>{title}</h2><div className="seo-scroll"><table><thead><tr><th>Name</th><th>Clicks</th><th>Impressions</th><th>CTR</th><th>Position</th></tr></thead><tbody>{rows.map((r, i) => <tr key={i}><td title={r.keys?.[0]}>{r.keys?.[0] || '—'}</td><td>{number(r.clicks)}</td><td>{number(r.impressions)}</td><td>{number(r.ctr * 100)}%</td><td>{number(r.position)}</td></tr>)}</tbody></table></div>{!rows.length && <p className="empty">Search Console has no data yet for this period.</p>}</section>;
}
function Trend({ rows, start, end }: { rows: DataRow[]; start: string; end: string }) {
  const points: DataRow[] = [];
  const indexed = new Map(rows.map(r => [String(r.date), r]));
  for (let date = new Date(`${start}T00:00:00Z`); date <= new Date(`${end}T00:00:00Z`); date.setUTCDate(date.getUTCDate() + 1)) {
    const key = date.toISOString().slice(0, 10).replaceAll('-', ''); points.push(indexed.get(key) || { date: key, activeUsers: 0 });
  }
  const max = Math.max(1, ...points.map(r => Number(r.activeUsers)));
  const coords = points.map((r, i) => `${20 + i / Math.max(1, points.length - 1) * 960},${170 - Number(r.activeUsers) / max * 140}`).join(' ');
  return <section className="panel trend"><div className="panel-title"><h2>Audience over time</h2><span>Active users · daily</span></div><svg viewBox="0 0 1000 200" role="img" aria-label="Daily active users"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#a78646" stopOpacity=".25"/><stop offset="100%" stopColor="#a78646" stopOpacity="0"/></linearGradient></defs>{[30, 100, 170].map(y => <line key={y} x1="20" x2="980" y1={y} y2={y} stroke="#e8e1d6"/>)}<polygon points={`20,180 ${coords} 980,180`} fill="url(#fill)"/><polyline points={coords} fill="none" stroke="#947336" strokeWidth="3"/>{points.map((r,i) => <circle key={i} cx={20 + i / Math.max(1, points.length - 1) * 960} cy={170 - Number(r.activeUsers) / max * 140} r="4" fill="#947336"><title>{String(r.date)}: {number(r.activeUsers)} active users</title></circle>)}</svg><div className="axis"><span>{start}</span><span>{end}</span></div></section>;
}
export function Dashboard() {
  const [session, setSession] = useState<boolean | null>(null);
  const [clientEnabled, setClientEnabled] = useState(false);
  const [mode, setMode] = useState('reviewer');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [days, setDays] = useState(28);
  const [tab, setTab] = useState('overview');
  const [result, setResult] = useState<Result | null>(null);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => { api('session').then(data => { setSession(data.authenticated); setClientEnabled(data.clientEnabled); }).catch(e => { setError(e.message); setSession(false); }); }, []);
  useEffect(() => {
    if (!session) return;
    let active = true; setBusy(true); setError(''); setResult(null);
    api(`reports&days=${days}`).then(data => { if (active) setResult(data); }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, [session, days, refresh]);
  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); setBusy(true); setError('');
    try { await api('login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode, email: form.get('email'), password: form.get('password') }) }); setSession(true); }
    catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }
  const brand = <div className="brand"><img src="/favicon.png" alt=""/><div>DESERT ROSE<span>BUSINESS INTELLIGENCE</span></div></div>;
  if (session === null) return <main className="login"><p>Opening private dashboard…</p></main>;
  if (!session) return <main className="login"><div className="login-card">{brand}<span className="eyebrow"><ShieldCheck size={14}/> Private workspace</span><h1>A clearer view<br/>of your audience.</h1><p>Website performance and search insights, together.</p><form onSubmit={signIn}>{clientEnabled && <label>Access<select value={mode} onChange={e => setMode(e.target.value)}><option value="reviewer">Private review</option><option value="customer">Customer</option></select></label>}{mode === 'customer' && <label>Email<input name="email" type="email" required autoComplete="username"/></label>}<label>{mode === 'reviewer' ? 'Review password' : 'Password'}<input name="password" type="password" required maxLength={256} autoComplete="current-password"/></label>{error && <p className="error" role="alert">{error}</p>}<button disabled={busy} className="primary">{busy ? 'Signing in…' : 'Enter dashboard'}<ArrowUpRight size={17}/></button></form><small>Access is controlled by the website administrator.</small></div></main>;
  const ga = result?.analytics.data; const seo = result?.search.data;
  return <div className="workspace"><aside>{brand}<div className="workspace-label">YOUR WORKSPACE</div><nav>{[['overview','Overview',BarChart3],['audience','Audience',Globe2],['interactions','Interactions',MousePointer2],['seo','Search & SEO',Search]].map(([id,label,Icon]) => { const ItemIcon = Icon as typeof Search; return <button key={String(id)} className={tab === id ? 'active' : ''} onClick={() => setTab(String(id))}><ItemIcon size={18}/>{String(label)}</button>; })}</nav><div className="sidebar-bottom"><ShieldCheck size={16}/><span>{clientEnabled ? 'Private dashboard' : 'Private review · customer access off'}</span></div><button className="sign-out" onClick={async () => { try { await api('logout', { method: 'POST' }); setSession(false); setResult(null); } catch { setError('Unable to sign out. Please retry.'); } }}><LogOut size={16}/>Sign out</button></aside><main className="content"><header><div><span className="eyebrow">THE DESERT ROSE GIN CO.</span><h1>{({overview:'Performance overview',audience:'Know your audience',interactions:'Every interaction counts',seo:'Your presence in search'} as Record<string,string>)[tab]}</h1><p>{result ? `${result.dates.startDate} — ${result.dates.endDate}` : 'Your website, measured.'}</p></div><div className="controls"><select aria-label="Reporting period" value={days} onChange={e => setDays(Number(e.target.value))}><option value={7}>Last 7 complete days</option><option value={28}>Last 28 complete days</option><option value={90}>Last 90 complete days</option></select><button aria-label="Reload reports" disabled={busy} onClick={() => setRefresh(v => v+1)}><RefreshCw size={17}/></button></div></header>{busy && <p className="notice" role="status">Reading your Google reports…</p>}{error && <p className="error" role="alert">{error}</p>}{result?.analytics.error && tab !== 'seo' && <p className="error">Analytics: {result.analytics.error}</p>}{tab === 'overview' && ga && <><div className="metrics">{[['Active users','activeUsers'],['Sessions','sessions'],['Page views','screenPageViews'],['Events','eventCount']].map(([label,key]) => <Metric key={key} label={label} value={Number(ga.summary[key] || 0)} previous={Number(ga.previous[key] || 0)}/>)}</div><Trend rows={ga.trend} start={result!.dates.startDate} end={result!.dates.endDate}/><div className="grid"><Table title="Most viewed pages" rows={ga.pages} label="pagePath" metric="screenPageViews" metricLabel="Views"/><Table title="How visitors find you" rows={ga.channels} label="sessionDefaultChannelGroup" metric="sessions" metricLabel="Sessions"/></div></>}{tab === 'audience' && ga && <><div className="grid"><Table title="Visitors by country" rows={ga.countries} label="country" metric="activeUsers" metricLabel="Active users"/><Table title="Devices" rows={ga.devices} label="deviceCategory" metric="activeUsers" metricLabel="Active users"/></div><p className="notice">Location is approximate. Consent choices and browser blockers affect measured visitor counts.</p></>}{tab === 'interactions' && ga && <><Table title="Recorded events" rows={ga.events} label="eventName" metric="eventCount" metricLabel="Events"/><p className="notice">This shows events received by GA4. Checkout clicks do not establish completed sales. Product views, cart actions, and purchases appear only when their tracking is connected. Event totals are not a user conversion funnel.</p></>}{tab === 'seo' && <>{result?.search.error && <p className="error">Search Console: {result.search.error}</p>}{seo && <><div className="metrics"><Metric label="Google search clicks" value={seo.summary.clicks || 0} previous={seo.previous.clicks}/><Metric label="Search impressions" value={seo.summary.impressions || 0} previous={seo.previous.impressions}/><Metric label="Click-through rate" value={(seo.summary.ctr || 0)*100} suffix="%"/><Metric label="Average position" value={seo.summary.position || 0}/></div><SearchTable title="Queries that bring people to you" rows={seo.queries}/><SearchTable title="Landing pages in Google" rows={seo.pages}/><SearchTable title="Search performance by country" rows={seo.countries}/><p className="notice">Search Console data is delayed and may omit recent days or private queries. Average position reflects your own search appearances; this is not a competitor rank tracker. Technical site audits are not included in these performance reports.</p></>}</>}<footer><span>DESERT ROSE · PRIVATE ANALYTICS</span><span>{result ? `Fetched ${new Date(result.generatedAt).toLocaleString()} · reports cached for 5 minutes` : 'Google Analytics 4 + Google Search Console'}</span></footer></main></div>;
}
