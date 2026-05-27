<!-- /autoplan restore point: /Users/bruno/.gstack/projects/GlobalAlora-marketplace/main-autoplan-restore-20260526-223029.md -->

# Plan: Auth System — AUTODUX

## Feature Summary
Build 3 auth pages (login, registro, recuperar) + update Header with auth state.
All visual only — no Supabase connection yet.

## Stack
- Next.js 16 App Router, TypeScript, Tailwind v4, Exo 2 (Google Font)
- Brand: `#282F8F` navy, `#FFC107` yellow, `#0D0F14` dark, `#F5F6FA` surface
- Real logo SVG at `/Users/bruno/Downloads/Logo Autodux.svg`

## Files to Create / Modify

### New files
1. `src/app/auth/login/page.tsx` — Login page (full page)
2. `src/app/auth/registro/page.tsx` — Registration page
3. `src/app/auth/recuperar/page.tsx` — Password recovery page
4. `src/components/auth/AuthLayout.tsx` — Shared dark wrapper for auth pages
5. `src/components/auth/LogoAutodux.tsx` — SVG logo component (inlined, white version)

### Modified files
6. `src/components/layout/Header.tsx` — Add user auth state (mock useState), dropdown

## Design Spec

### AuthLayout
- Full-page dark: `bg-[#0D0F14]` with subtle dot-grid or car silhouette texture
- Centered content column: max-w-[420px]
- Logo + AUTODUX text above the card
- Card: `bg-[#1a1a2e]` border `border-white/10` rounded-2xl shadow-2xl

### Login page
- Card fields: email (icon), password (icon + show/hide toggle)
- "¿Olvidaste tu contraseña?" link below password
- CTA: `bg-[#FFC107]` "Iniciar sesión" button
- Divider: "o continuá con"
- Google button: outline style, white text, Google G icon (SVG)
- Footer: "¿No tenés cuenta? Registrate" → /auth/registro

### Registro page
- 3-column row: nombre | apellido (2-col grid) + email full width
- teléfono + contraseña + confirmar contraseña
- Inline validation indicator (password match visual)
- CTA: "Crear cuenta" yellow
- Footer: "¿Ya tenés cuenta? Iniciá sesión" → /auth/login

### Recuperar page
- Single email field
- CTA: "Enviar link de recuperación"
- After submit: `sent` state → success message (no redirect)

### Header update
- Mock `const [user, setUser] = useState<MockUser | null>(null)` — null = not logged in
- Not logged in: existing "Ingresar" button → href="/auth/login"
- Logged in: avatar circle (initials) + nombre + chevron → dropdown
  - Dropdown items: "Mi panel" (→ /panel), "Cerrar sesión" (→ clears user)
- Desktop: right side after nav links
- Mobile: in hamburger menu

## Decision Audit Trail

| # | Phase | Decision | Classification | Principle | Rationale | Rejected |
|---|-------|----------|----------------|-----------|-----------|---------|
| 1 | CEO | Auth pages standalone (no MainLayout) | Mechanical | P5 | Standard auth UX, focused experience | MainLayout wrap |
| 2 | CEO | PanelLoginHero unchanged | Mechanical | P3 | Already links to /auth/login, MVP acceptable | Refactor now |
| 3 | CEO | Mock useState with // TODO comment | Mechanical | P5 | Makes future Supabase swap obvious | No comment |
| 4 | CEO | Logo: white icon paths on dark bg | Mechanical | P5 | Dark auth bg requires light logo | Keep navy |
| 5 | Design | Include all input states (focus/error/match/loading) | Mechanical | P1 | Completeness — forms without error states are incomplete | Happy path only |
| 6 | Design | Standalone auth layout (no site header/footer) | Mechanical | P5 | Focused auth UX, standard industry pattern | MainLayout wrap |
| 7 | Design | Google button outline style (not filled) | Mechanical | P5 | Brand guideline: yellow reserved for primary CTA | Yellow Google button |
| 8 | Eng | SVG paths use hardcoded fill="#fff" not className | Mechanical | P5 | Simpler than JSX className, avoids Tailwind SVG class conflicts | className approach |
| 9 | Eng | Header dropdown: reuse existing search useRef pattern | Mechanical | P4 | DRY — same click-outside pattern already exists in Header | New custom hook |
| 10 | Eng | No middleware (visual only) | Mechanical | P3 | No backend = no auth to check | Add middleware now |

## GSTACK REVIEW REPORT
