# Private analytics dashboard

The dashboard is a separate Vite entry at `/dashboard`. It does not load the
storefront, age gate, music, or analytics tracking scripts. The only data endpoint
is `/api/dashboard`, shared by Vercel and local Express. No emails are sent.

## Environment setup

The four Google variables in `.env.example` connect GA4 and Search Console.
Use the downloaded JSON's `private_key` value, not the entire file; literal
`\n` escapes and actual newlines are supported. Keep these variables server-side.

Before review, also configure in Vercel:

- `DASHBOARD_REVIEW_PASSWORD`: an independent, randomly generated password of at
  least 20 characters. Use a password manager to generate and retain it.
- `DASHBOARD_SESSION_SECRET`: a different random value of at least 32 characters.
- `DASHBOARD_CLIENT_ACCESS_ENABLED`: `false` (also the default when missing).

Deploying applies the environment settings. Nothing is deployed or sent by the
implementation itself. For local development, export the environment before
running `npm run dev:raw`; the existing development server does not load `.env`
automatically. Do not commit a credentials JSON or environment file.

## Review and handover

Only the review password is needed during review. Customer sign-in is hidden
and refused by the server while client access is off. Do not give the review
password to the customer. After invoice/payment and explicit handover, set a
separate `DASHBOARD_CLIENT_PASSWORD` (at least 20 random characters), set
`DASHBOARD_CLIENT_ACCESS_ENABLED=true`, and redeploy. Customer sign-in accepts
only `desertrosegin@gmail.com` plus that password. This is password login, not
Google sign-in; no OAuth client or email delivery service is needed. Turning
client access back off invalidates existing customer sessions. Rotate the
session secret to invalidate all sessions.

Sessions expire after 8 hours, are HMAC-signed, and use HttpOnly, SameSite=Strict
cookies (Secure in production). Private API responses are never publicly cached.
Login has a per-process attempt limit; distributed brute-force protection should
be configured in the Vercel Firewall before wider access. Long random passwords
are required even for review. Google library credentials stay on the server.

## Reports

GA4: active users, sessions, page views, events, previous-period comparison,
daily trend, countries, pages, acquisition channels, and devices. Search Console:
clicks, impressions, CTR, position, queries, landing pages, and countries.
Only 7, 28, and 90 complete-day windows are accepted. Google reports are cached
in server memory for 5 minutes after both sources succeed. Errors and empty
reports have explicit states; there is no fabricated demo data. Either source
can work while the other reports a configuration error.

GA4 uses the property's time zone for date ranges, so reports end at yesterday's
UTC calendar date to avoid claiming current-day completeness. Search Console's
final data can lag further. Search rows are top rows, not a complete query dump.
Location is approximate. Event counts are not a sequential user funnel. Revenue
and completed purchases require checkout/order instrumentation. Technical SEO
crawls, competitor rankings, real-time visitors, and exports are not included
in this initial version.

The existing storefront currently pushes custom events to `dataLayer`; those
events reach GA4 only if a matching Google Tag Manager configuration exists.
The current code contains a direct GA4 tag, so confirm event delivery with
DebugView before interpreting absent cart/contact events as zero interactions.

## Validation

Run `npm run check`, `npm run build:client`, and
`node --import tsx script/test-dashboard.ts`.
Live acceptance requires a deployment with the configured environment:
verify private access rejects anonymous requests, reviewer login reads both
sources, date ranges change, and customer login remains disabled. No live
credentials are needed for the automated auth and report-normalization tests.
