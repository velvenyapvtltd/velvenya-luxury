# VELVENYA — Coming Soon Site PRD

## Original Problem Statement
Brand: **VELVENYA** — modern Indian eco-luxury house (handbags & accessories).  
Founder: **Pintu Padhy**.  
Tagline: *"Silence is the oldest luxury."*  
Location: Andhra Pradesh, India.  
Contact: velvenyapvtltd@gmail.com · Instagram @velvenya · LinkedIn Velvenya Private Limited.  
Constraint: NO countdown timer. Text-only / minimal — no imagery. Instagram + LinkedIn active; other socials placeholder (#).

## User Choices (2026-12)
- Email signup / waitlist: **Yes**, stored in MongoDB.
- Visual style: **Designer-decided** → Organic & Earthy (bone white / charcoal / moss-green) with Cormorant Garamond + Outfit.
- Hero imagery: **Text-only / minimal** — no imagery.
- Sections: **All** including Philosophy / Craftsmanship feature block.

## Architecture
- **Backend**: FastAPI (`/app/backend/server.py`) — MongoDB `waitlist` collection.
- **Frontend**: React + Tailwind, single-page `ComingSoon` route (`/app/frontend/src/pages/ComingSoon.jsx`).
- **Design tokens**: `/app/design_guidelines.json`.

## Implemented (2026-12)
- Backend endpoints:
  - `GET  /api/` — brand welcome
  - `POST /api/waitlist` — create waitlist entry (idempotent, lower-cased email)
  - `GET  /api/waitlist` — list entries (most-recent first, `_id` excluded)
  - `GET  /api/waitlist/count` — total count
- Frontend sections:
  - Glassmorphic fixed nav, anchor links
  - Hero (massive VELVENYA wordmark + tagline, fade-up entrance)
  - Editorial marquee of brand values
  - Brand + Founder bento block
  - Philosophy/Craftsmanship 3-card grid
  - Collections list (5 categories, italic hover)
  - Waitlist signup (dark section, success state)
  - Footer with email, location, social links (Instagram/LinkedIn live, Twitter/Facebook = `#`)
- Sonner toast notifications for form feedback.
- Backend tests: 11/11 passing (`/app/backend/tests/test_waitlist.py`).

## Backlog
### P1
- Rate-limit `POST /api/waitlist` (IP throttling) — currently open to abuse.
- Add unique index on `waitlist.email` (Mongo).
- Admin-protected route to export waitlist as CSV.

### P2
- Migrate `@app.on_event` → FastAPI lifespan handler.
- Tighten CORS origins via env.
- Email confirmation when joining waitlist (Resend / SendGrid integration).
- Reveal countdown / product photography once launch date is set.

## Personas
- **Curious visitor** — discovers brand pre-launch, wants to subscribe for early access.
- **Press / partner** — needs founder + contact info, links to socials.
- **Pintu (founder)** — wants a tasteful holding page that reflects brand values until full e-commerce launch.

## Next Action Items
- Decide launch date & re-enable countdown.
- Connect email service (Resend / SendGrid) for waitlist confirmations.
- Add admin export view.
