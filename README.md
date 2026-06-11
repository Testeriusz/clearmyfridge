# ClearMyFridge

Fridge tracker, expiry alerts, AI recipe suggestions, and shopping list. React + Vite SPA on Vercel with Supabase backend.

## Stack
- **Frontend** — React 19, Vite 8, custom CSS (no Tailwind)
- **Backend** — Vercel serverless functions (`/api`)
- **Database** — Supabase (PostgreSQL + RLS)
- **Auth** — Supabase Auth (Google OAuth)
- **AI** — Anthropic Claude Haiku (`/api/recipes`, `/api/plan`, `/api/suggest`)
- **Email** — Resend
- **Push** — OneSignal
- **Cron** — Vercel cron (`0 8 * * *`) → `/api/cron/alerts`

## Local dev
```bash
npm install
npm run dev
```

## Environment variables
| Variable | Where |
|---|---|
| `VITE_SUPABASE_URL` | Supabase → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API (cron only) |
| `ANTHROPIC_API_KEY` | Anthropic console |
| `RESEND_API_KEY` | Resend dashboard |
| `ONESIGNAL_APP_ID` | OneSignal → Keys & IDs |
| `ONESIGNAL_API_KEY` | OneSignal → Keys & IDs |
| `VITE_ONESIGNAL_APP_ID` | Same as above (client-side) |
| `CRON_SECRET` | Any random string |

## Supabase tables
`fridge_items` · `shopping_items` · `saved_recipes` · `user_preferences` · `alert_log`
