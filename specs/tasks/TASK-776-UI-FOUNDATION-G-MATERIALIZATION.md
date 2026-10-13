---
{
  "id": "TASK-776",
  "title": "Materialize owner-requested independent G adoption",
  "status": "ready",
  "priority": 776,
  "milestone": "WP-UI-FOUNDATION-01",
  "model_tier": "cheap",
  "risk": "low",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/021-station-ui-foundation/ADDENDUM.md",
    "docs/adr/ADR-0017-station-visual-shell-foundation.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-G.md",
    "packages/ui-core/README.md",
    "packages/ui-core/industrial.ts",
    "packages/ui-core/overlays.tsx",
    "apps/station/web/app/station-file-manager-workbench.tsx"
  ],
  "allowed_paths": [
    "specs/tasks/TASK-776-UI-FOUNDATION-G-MATERIALIZATION.md",
    "specs/tasks/TASK-777-UI-FOUNDATION-FILE-MANAGER-ADOPTION.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-G.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-PLAN.md",
    "docs/current/NEXT_WORK.md"
  ],
  "forbidden_paths": [
    "apps/core/**",
    "packages/station-editor/**",
    "packages/station-composition/**",
    "packages/ui-icons/**",
    ".github/**"
  ],
  "max_files": 5,
  "validation": [
    "npm run lint",
    "npm run typecheck",
    "npm run check:docs",
    "node --import tsx tooling/agent-harness/src/cli.ts validate-tasks",
    "node --import tsx tooling/agent-harness/src/cli.ts architecture"
  ]
}
---
## Objective
Record the owner's explicit 2026-10-13 instruction to proceed to G and materialize only main-integrated File Manager presentation adoption.
## Required change
Fresh main94da5ae2 and open draft F PR1144/ce3d0e51 are verified. F remains partial; no promotion of its unfinished registry/schema. This is an owner-requested sequencing exception for independent G scope, not satisfaction or removal of F acceptance. Use only integrated A–E public APIs. Preserve primary ICON/WP02 handoff. TASK777 owns source and actual browser proof.
## Acceptance criteria
Bounded paths/dependencies/tests and G partial status are durable before code. No F integration/closure claim.
## Non-goals
F schema/editor changes, ICON pack, Studio owner transport.
## Evidence expected
Fresh source/base/PR metadata; docs/tasks/architecture validation.

## Context
Bounded main-integrated adoption; partial F remains separate. Stop for failed checks or conflicting source authority.

## Current behavior
Bounded main-integrated adoption; partial F remains separate. Stop for failed checks or conflicting source authority.

## Inputs / contracts
Bounded main-integrated adoption; partial F remains separate. Stop for failed checks or conflicting source authority.

## Outputs / contracts
Bounded main-integrated adoption; partial F remains separate. Stop for failed checks or conflicting source authority.

## Escalation
Bounded main-integrated adoption; partial F remains separate. Stop for failed checks or conflicting source authority.
