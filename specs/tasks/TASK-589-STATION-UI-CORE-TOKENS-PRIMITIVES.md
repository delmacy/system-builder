---
id: TASK-589
title: Establish Station UI core tokens and accessible primitives
status: blocked
priority: 589
milestone: STATION-VISUAL-M1
model_tier: strong
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-588
context_paths:
  - docs/architecture/STATION_FRONTEND_FOUNDATION.md
  - project_docs/generation-4/research/G4_FRONTEND_DESIGN_SYSTEM_FOUNDATION_PLAN.md
allowed_paths:
  - packages/ui-core/**
  - apps/station/**
  - tests/product/station-ui-core.test.ts
  - specs/tasks/TASK-589-STATION-UI-CORE-TOKENS-PRIMITIVES.md
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
Add semantic CSS variables/tokens and the bounded primitive set required by M1: Button, IconButton, Toggle, Select, Input, Separator, Tooltip/Menu surface, Panel, ScrollArea and Badge/focus utilities. Preserve provider replaceability.

# Inputs / contracts
ADR-0017 and G4 frontend research.

# Outputs / contracts
`ui-core` public exports and a rendered primitive smoke surface.

# Acceptance criteria
No product component hardcodes raw domain/status colors; light/dark render; focus is visible; reduced motion has a static equivalent; primitives are reusable outside Station shell.

# Non-goals
No bespoke final brand, Canvas, Grid, data forms, Workflow components or generated client design system.

# Evidence expected
Token normalization tests, render/type proof and component-state inventory hooks.

# Escalation
Stop if a primitive library forces opaque runtime ownership or prevents source-level adaptation/accessibility correction.
