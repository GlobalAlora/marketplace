<!-- /autoplan restore point: /Users/bruno/.gstack/projects/GlobalAlora-marketplace/main-autoplan-restore-20260529-143147.md -->

# Plan: Mejora Ficha Individual de Vehículo `/vehiculos/[id]`

**Proyecto:** AUTODUX Marketplace — Comodoro Rivadavia
**Branch:** main
**Fecha:** 2026-05-29

---

## Objetivo

Transformar la ficha de vehículo de una página básica a una experiencia premium dark con galería completa, specs técnicas con iconos, perfil del vendedor expandido y secciones de recomendación.

---

## Archivos a tocar

| Archivo | Tipo de cambio |
|---|---|
| `src/types/index.ts` | Agregar campos opcionales a `Vehiculo` |
| `src/lib/utils/mock-data.ts` | Agregar múltiples imágenes + campos técnicos |
| `src/components/vehiculos/GaleriaImagenes.tsx` | Agregar flechas nav + lightbox |
| `src/components/vehiculos/InfoVehiculo.tsx` | Specs con iconos + vendedor expandido |
| `src/app/vehiculos/[id]/page.tsx` | Agregar secciones "Otros del vendedor" + "Similares" |

---

## Decisiones de diseño

- Tema: dark premium (`#0D0F14` bg, `#FFC107` accent, `#282F8F` navy)
- Galería: imagen 4:3 grande + miniaturas (scroll horizontal móvil) + flechas sup izq/der + lightbox fullscreen con Escape para cerrar
- Specs técnicas: grid 2 cols, iconos SVG inline (sin dependencias externas), label pequeño gris + valor blanco bold
- Vendedor agencia: logo placeholder (iniciales en circle), badge "Verificado ✓", botón "Ver perfil de agencia"
- Vendedor particular: avatar con iniciales, fecha "Miembro desde", botón "Ver perfil"
- Secciones de recomendación: grid 3 cards horizontales, misma `VehiculoCard` existente
- Breadcrumb: sin cambios de estructura, solo mejoras visuales menores

---

## Decision Audit Trail

| # | Phase | Decision | Classification | Principle | Rationale | Rejected |
|---|-------|----------|----------------|-----------|-----------|---------|
| 1 | CEO | Fix mock data antes de UI (multi-imágenes + campos técnicos) | Mechanical | P1 completeness | Sin datos reales, la galería y las specs no se pueden probar ni demostrar | Construir UI primero |
| 2 | CEO | Agregar campo `vistas` al mock (trust signal) | Boil lakes | P2 | 1 campo, alto impacto en confianza del comprador — en blast radius | Solo mostrar WhatsApp |
| 3 | CEO | Mantener sección "Vehículos similares" | Taste → kept | P6 action | 8 vehículos es suficiente para demo con filtro misma marca / rango precio ±30% | Diferir post-Supabase |
| 4 | CEO | Agregar badge contextual patagónico en specs | Boil lakes | P2 | Diferenciador vs MercadoLibre, 1 línea de copy, alto valor de marca | Ignorar |
| 5 | Design | Lightbox: fixed-position overlay, no portal | Mechanical | P5 | GaleriaImagenes ya es 'use client'; portal agrega complejidad SSR sin beneficio | Portal |
| 6 | Design | Orden info: precio → specs → descripción → vendedor → CTA | Mechanical | P5 | Buyer flow correcto, precio primero siempre | Specs antes que precio |
| 7 | Design | Recs mobile: overflow-x scroll-snap, 3-col en md+ | Mechanical | P5 | Sin especificar → implementador elige mal | Grid fijo 3-col en mobile |
| 8 | Design | Ocultar sección cuando hay 0 vehículos del vendedor | Mechanical | P5 | Heading vacío peor que no mostrar nada | Mostrar empty state |
| 9 | Eng | filter(exclude self) antes de slice(0,3) | Mechanical | P1 | Slicing primero puede incluir el vehículo actual | Slice primero |
| 10 | Eng | Wrap-around modulo para prev/next galería | Mechanical | P1 | Sin modulo: click prev en índice 0 = undefined | Clamp sin wrap |

---

## GSTACK REVIEW REPORT
