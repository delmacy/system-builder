---
id: TASK-637
title: STATION S4 WP1-B Layers & Selection
status: ready
priority: 637
milestone: STATION-S4-VISUAL-FACTORY-WP1
depends_on:
  - TASK-636
allowed_paths:
  - packages/station-editor/**
  - tests/product/station-editor-layers-selection.test.ts
  - specs/tasks/TASK-637-STATION-S4-WP1B-LAYERS-SELECTION.md
  - docs/current/NEXT_WORK.md
forbidden_paths:
  - apps/**
  - packages/core/**
max_files: 8
validation:
  - npm run verify
---

# TASK-637 — WP1-B Layers & Selection

TASK-636 is integrated. Build a deterministic Layers hierarchy from the Station editor session with stable node references.

Required: keep selection, focus, active and expansion independent; deterministic select/clear/expand/collapse; reject stale, unknown, malformed, duplicate or incompatible references before mutation; rejected operations leave editor draft and interaction state unchanged.

Preserve C0→C9 and keep C10 deferred. Layers is a projection, not a competing canonical model. No Inspector editing, grid/span editing, Preview, persistence, provider/runtime/deploy work, or business authority.

Proof: focused executable product test plus npm run verify on the exact implementation head. Cover happy, negative, adversarial, retry/idempotence and zero-partial-mutation cases. If this task introduces DOM/focusable UI, keyboard and accessibility proof is mandatory; otherwise record accessibility as N/A until the first UI surface.

Do not begin WP1-C until TASK-637 is integrated and fresh main is reconciled.
