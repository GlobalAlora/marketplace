<!-- /autoplan restore point: /Users/bruno/.gstack/projects/GlobalAlora-marketplace/main-autoplan-restore-20260601-082821.md -->

# Plan: Infraestructura Base AUTODUX

**Proyecto:** AUTODUX Marketplace — Comodoro Rivadavia
**Branch:** main
**Fecha:** 2026-06-01

---

## Objetivo

Tres tareas de infraestructura que habilitan producción:
1. Página 404 on-brand (dark, #FFC107, logo, CTAs)
2. SEO base completo (metadata, OG, sitemap, robots)
3. Schema SQL Supabase completo listo para ejecutar

---

## Archivos a tocar

| Archivo | Operación |
|---|---|
| `src/app/not-found.tsx` | CREAR — 404 dark AUTODUX |
| `src/app/layout.tsx` | EDITAR — metadata completa |
| `src/app/sitemap.ts` | CREAR — sitemap dinámico |
| `src/app/robots.ts` | CREAR — robots.txt |
| `src/app/opengraph-image.tsx` | CREAR — OG image con ImageResponse |
| `docs/supabase-schema.sql` | CREAR — schema completo con RLS y triggers |

---

## Decisiones de diseño

- **404**: dark full-screen, `#0D0F14` bg, "404" en `#FFC107` con fuente extrabold, logo + texto + 2 CTAs
- **SEO**: URL base `https://marketplace-sigma-teal.vercel.app` (prod); cuando se tenga dominio propio, cambiar `metadataBase`
- **OG image**: `1200×630`, fondo `#0D0F14`, logo SVG inline + texto blanco
- **sitemap**: rutas estáticas (`/`, `/vehiculos`, `/auth/login`, `/auth/registro`) + rutas dinámicas de vehículos del mock (prod: query Supabase)
- **robots**: allow all en dev/staging; adjust para prod cuando haya dominio
- **SQL schema**: PostgreSQL (Supabase), RLS activado, trigger `on_auth_user_created` para auto-crear profile, storage bucket `vehiculos-imagenes`

---

## Decision Audit Trail

| # | Phase | Decision | Classification | Principle | Rationale | Rejected |
|---|-------|----------|----------------|-----------|-----------|---------|

---

## GSTACK REVIEW REPORT
