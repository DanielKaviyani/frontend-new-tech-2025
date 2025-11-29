## Changelog
- Added OWASP-based Next.js security overview, recommendations, checklist, and sample code.
- Expanded coverage for frontend optimization, multi-framework patterns, and auth/JWT/API guidance sourced from OWASP Cheat Sheet Series.

# Security Guide — Next.js (OWASP-based)

## Summary — 2–3 concise sentences describing purpose and audience.
This guide distills OWASP guidance into Next.js-specific actions for frontend and full-stack engineers working on App Router projects. It maps Cheat Sheet learnings to React, Vue, and Nuxt teams that share the same HTML/CSS/JS security posture. Use it to audit new features, harden deployments, and onboard teammates quickly while keeping API and authentication layers optimized.

## Recommended OWASP Cheat Sheets — a Markdown table (name + one-sentence use case).
| Cheat Sheet | Why it matters |
| --- | --- |
| [OWASP Secure Headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html) | Pick safe defaults for CSP, HSTS, XFO, and other critical headers. |
| [OWASP Content Security Policy](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html) | Keep script/style origins locked down across React/Vue/Nuxt apps. |
| [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) | Design cookie-based sessions with idle timeouts, rotation, and HttpOnly flags. |
| [OWASP JSON Web Token](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html) | Harden JWT issuance, signing, and rotation for SPA ↔ API flows. |
| [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) | Understand output encoding and sanitization needed around `dangerouslySetInnerHTML`. |
| [OWASP DOM based XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) | Guard client-side JS/HTML mutations including `v-html` and DOM APIs. |
| [OWASP Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) | Normalize and validate SSR, Server Action, and form input before use. |
| [OWASP REST Security](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html) | Secure API routes with authz, rate limits, and uniform error handling. |
| [OWASP OAuth 2.0 Security](https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Security_Cheat_Sheet.html) | Protect SSO and delegated auth flows that drive frontend login UX. |
| [OWASP Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) | Capture forensic breadcrumbs without leaking secrets in server logs. |

## Next.js — Practical Recommendations — bullet list of security recommendations (Cookies, SSR, CSP, dangerouslySetInnerHTML, headers).
- Cookies: issue session/refresh cookies as `HttpOnly`, `Secure`, `SameSite=Strict` by default, rotating identifiers on privilege change.
- SSR: validate all request data in Route Handlers or Server Actions before rendering; never trust `headers()` or `cookies()` values until schema-checked.
- CSP: enforce strict CSP via middleware with nonces for inline scripts and disable `unsafe-inline`; monitor violations with a report-uri endpoint.
- `dangerouslySetInnerHTML`: restrict to vetted CMS sources, sanitize with DOMPurify server-side, and gate behind feature flags.
- Headers: centralize security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy) in middleware and test using `next dev --turbo` plus security scanners.
- API Routes & Server Actions: require auth tokens, perform schema validation, normalize errors, and block n+1 calls with rate limiting per IP/user.
- Authentication & JWT flows: keep refresh logic server-side, pin signing algorithms, rotate secrets, and throttle login to outlast credential stuffing.
- HTML/CSS/JS hygiene: ban inline event handlers, hash CSS Modules, and strip attacker-controlled classes or styles before rendering components.
- Framework parity: apply the same sanitize/escape helpers when sharing UI libraries across React, Next.js, Vue, and Nuxt to avoid divergent security drift.
- Security-aware optimization: configure ISR/Edge caching with `Cache-Control: private` for auth views, vary on `Authorization`, and purge caches on role changes to keep security and performance balanced.

## Security Checklist (Actionable) — checkbox list (- [ ]) that developers can follow step-by-step.
- [ ] Define threat model for the feature (entry points, data sensitivity, attacker goals).
- [ ] Confirm all API routes require auth and role-/scope-based authorization.
- [ ] Add security headers middleware and run automated tests to assert header presence.
- [ ] Ensure cookies use `HttpOnly`, `Secure`, `SameSite`, short TTLs, and rotation on login/logout.
- [ ] Validate and sanitize all SSR/ISR props and strip HTML before using `dangerouslySetInnerHTML`.
- [ ] Enable rate limiting for login-sensitive routes and monitor logs for anomalies.
- [ ] Document recovery + incident steps in README/operations runbook before release.
- [ ] Review caching/CDN configs so personalized pages bypass shared caches while static assets stay optimized.
- [ ] Pen-test Server Actions/API Routes for injection, mass assignment, and SSRF before shipping.
- [ ] Verify JWT signing keys, expiry windows, and refresh paths in staging with automated tests.
- [ ] Run HTML/CSS/JS linters (eslint-plugin-security, stylelint) to catch dangerous inline patterns in shared design systems.

## Example Code — include 3 copy-ready code blocks:

Middleware enforcing strict headers and hardened cookies.
```ts
// middleware.ts — enforce headers and secure cookies
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'",
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Content-Type-Options': 'nosniff',
};

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  response.cookies.set({
    name: 'session',
    value: request.cookies.get('session')?.value ?? '',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
  });

  return response;
}
```

In-memory token bucket to cap per-IP API calls.
```ts
// rateLimit.ts — simple in-memory token bucket for API routes
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;
const buckets = new Map<string, { tokens: number; updatedAt: number }>();

export function isRateLimited(key: string) {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: MAX_REQUESTS, updatedAt: now };
  const elapsed = now - bucket.updatedAt;
  const refill = Math.floor(elapsed / WINDOW_MS) * MAX_REQUESTS;
  bucket.tokens = Math.min(MAX_REQUESTS, bucket.tokens + refill);
  bucket.updatedAt = now;
  if (bucket.tokens <= 0) {
    buckets.set(key, bucket);
    return true;
  }
  bucket.tokens -= 1;
  buckets.set(key, bucket);
  return false;
}
```

JWT helper issuing HttpOnly cookies and refreshing tokens safely.
```ts
// auth.ts — verify JWT, set HttpOnly cookies, refresh when expiring
import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function issueTokens(payload: Record<string, unknown>) {
  const access = await new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('15m').sign(secret);
  const refresh = await new SignJWT({ sub: payload.sub }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('30d').sign(secret);
  return { access, refresh };
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload;
}

export async function handleRefresh(refreshToken: string, cookies: ReturnType<typeof import('next/headers').cookies>) {
  const payload = await verifyToken(refreshToken);
  const tokens = await issueTokens({ sub: payload.sub, roles: payload.roles });
  cookies().set({ name: 'access', value: tokens.access, httpOnly: true, secure: true, sameSite: 'strict', path: '/', maxAge: 900 });
  cookies().set({ name: 'refresh', value: tokens.refresh, httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 });
  return tokens;
}
```

## Notes & Best Practices — 3–7 short bullet points
- Automate header and cookie regression tests with Playwright or Cypress smoke suites.
- Feed CSP violation reports into logging to catch chrome extensions or compromised content.
- Use `next-safe-middleware` or similar packages if you need centrally managed policies but audit the defaults.
- Rotate signing keys annually and document the last rotation date.
- Mirror CSP, sanitization, and cookie policies across federated React, Vue, and Nuxt microfrontends to avoid weakest-link gaps.
- Share rate-limit/backoff utilities between API Routes, Server Actions, and edge middleware so abuse controls stay consistent without hurting performance budgets.

## References — list of OWASP links/resources
- https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Security_Cheat_Sheet.html

