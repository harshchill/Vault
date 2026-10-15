# Security Review

Read-only review of the Vault repository, completed 2026-10-15. This is a
source-code and dependency review, not a penetration test or production
configuration audit.

## Findings

| # | Severity | Location | Finding | Confidence |
|---|---|---|---|---:|
| 1 | HIGH | `app/api/auth/[...nextauth]/route.js:91-98, 124-140` | OAuth sign-in associates accounts by email without checking that the provider verified the email. If an attacker can authenticate using an unverified address matching a user or administrator account, that account may be impersonated. | 8/10 |
| 2 | HIGH | `package-lock.json:9297-9300`; `app/component/pdfViewer.js:103-105`; `app/api/papers/route.js:150-151, 193-199` | The locked `pdfjs-dist` version is 3.11.174, reported affected by GHSA-wgrm-67xf-hhpq. The app processes uploaded, user-controlled PDF URLs in the browser via React-PDF. A malicious PDF can target a user who opens it, after moderator approval. | 9/10 |
| 3 | MEDIUM | `app/api/papers/route.js:273-287, 512-530`; `app/api/auth/[...nextauth]/route.js:67-87` | Privileged paper API routes authorize using the role claim from `getToken()`, while the NextAuth JWT role refresh runs separately. A demoted administrator's existing token can retain access until refreshed or expired. | 9/10 |
| 4 | CRITICAL* | `package.json:23`; `package-lock.json:8767-8771` | The locked Next.js version is 16.0.7, reported affected by GHSA-p293-qw3h-jr36, an unauthenticated RCE advisory for Windows-hosted Next.js servers below 16.3.3. This critical impact is conditional on the production host running Windows. | 9/10 |

### Recommended remediation order

1. Require verified email claims from OAuth providers before account matching or creation; bind provider identities to provider subject IDs.
2. Upgrade Next.js and PDF.js/React-PDF to patched compatible versions, and ensure the deployed PDF worker matches the library.
3. Re-check the current database role for privileged API operations or invalidate sessions when an administrator is demoted or removed.
4. Confirm the production host OS; prioritize the Next.js RCE upgrade as critical if production runs on Windows.

## Scope and limitations

- The review covered repository auth/session and role checks, API routes and server actions, PDF upload/viewing, database setup, relevant configuration, and locked dependency versions.
- The Next.js RCE's applicability depends on production host OS. Dependency advisory status should be reconfirmed against the package registry before deployment.
- No code changes, live exploitation, production configuration checks, or load tests were performed.
