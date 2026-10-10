---
id: TASK-649
title: Station S4 WP2 Window Editor Journey
status: ready
priority: 649
milestone: STATION-S4-WP2-EDITOR-OPERATIONAL
model_tier: architecture
risk: medium
architecture_impact: false
depends_on:
  - TASK-648
context_paths:
  - AGENTS.md
  - docs/DOCUMENT_AUTHORITY.md
  - docs/contracts/003-station-editor-operational-journey/ADDENDUM.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/STATION-S4-WP2-CONSTRUCTION-B-01.md
  - packages/station-app-runtime/**
  - packages/station-windowing/**
  - apps/station/web/app/station-editor-workbench.tsx
allowed_paths:
  - apps/station/web/app/station-foundation-client.tsx
  - packages/station-windowing/window-frame.tsx
  - tests/browser/station-editor-workbench.spec.ts
  - specs/tasks/TASK-649-STATION-S4-WP2-WINDOW-EDITOR.md
  - project_docs/execution_planning/STATION-S4-WP2-CONSTRUCTION-B-01.report.md
forbidden_paths:
  - packages/station-editor/**
  - packages/station-composition/**
  - .github/**
  - provider/**
  - runtime/**
  - deploy/**
max_files: 5
validation:
  - npm run verify
  - npm run station:build
  - npx playwright test --config tests/browser/station-editor.playwright.config.ts
---

# TASK-649 — Station Window Editor Journey

Wire TASK-648 app into the ordinary Station launcher and WindowFrame on the desktop. Ensure minimize keeps one mounted workbench draft, selection and fields, restore returns it, and close unmounts it; reopening starts fresh. The hidden minimized window must not be visible or keyboard reachable. Preserve independent non-editor windows and existing /component-editor route. Existing Station layout storage must serialize only presentation fields, not editor graphs or drafts. Actual browser tests start at /, use launcher/taskbar, prove positive edit/save/discard, minimize/restore, close/reopen, negative bounds/switch and layout payload boundary; retain all ten WP1/A regressions. WindowFrame lifecycle adjustment remains internal L2 with no public schema change. Run full validation and report exact-head/browser evidence.
