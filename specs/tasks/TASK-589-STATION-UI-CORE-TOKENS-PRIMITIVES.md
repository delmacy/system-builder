---
id: TASK-589
title: Establish Station UI core tokens and accessible primitives
status: completed
priority: 589
milestone: STATION-VISUAL-M1
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-588
context_paths:
  - docs/architecture/STATION_FRONTEND_FOUNDATION.md
allowed_paths:
  - packages/ui-core/**
  - apps/station/**
  - tests/product/station-ui-core.test.ts
  - specs/tasks/TASK-589-STATION-UI-CORE-TOKENS-PRIMITIVES.md
forbidden_paths:
  - apps/station-gateway/**
  - packages/runtime-core/**
  - packages/deploy/**
  - packages/compiler/**
  - .github/workflows/**
max_files: 18
validation:
  - npm run lint
  - npm run typecheck
  - npm run test:product
  - npm run verify
---

# Objective
Create the source-owned visual primitive/token substrate used by every M1 shell surface.

# Context
G4 research requires semantic tokens, light/dark support, visible focus, reduced-motion support and state meaning that is not color-only.

# Current behavior
No Station design system exists.

# Required change
Adopt shadcn/ui as the explicit open-code visual/source baseline for M1 while keeping SB ownership. Add shadcn-compatible semantic OKLCH CSS variables/tokens, `data-slot` anatomy and the bounded dependency-light primitive set required by M1: Button, IconButton, Toggle, native Select, Input, Separator, Tooltip surface, Menu surface, Panel, ScrollArea and Badge/focus utilities. Keep complex headless behavior providerized for later Base UI/Radix use rather than pulling it into M1 prematurely. Preserve provider replaceability.

# Inputs / contracts
ADR-0017 and G4 frontend research.

# Outputs / contracts
`ui-core` public exports and a rendered primitive smoke surface.

# Acceptance criteria
No product component hardcodes raw domain/status colors; light/dark/system-compatible tokens render; focus is visible; reduced motion has a static equivalent; primitives expose stable SB-owned APIs and `data-slot` hooks; Station smoke UI uses the actual primitives; no shadcn/Base UI/Radix runtime identity leaks into product semantics.

# Non-goals
No bespoke final brand, Canvas, Grid, data forms, Workflow components or generated client design system.

# Evidence expected
Token normalization tests, render/type proof and component-state inventory hooks.

# Escalation
Stop if shadcn/Base UI/Radix would force opaque runtime ownership, prevent source-level adaptation/accessibility correction, or require the Station shell to depend on provider-specific identities.
