---
{
  "id": "TASK-760",
  "title": "Persist reviewed visual evidence and reconcile active F handoff",
  "status": "verification",
  "priority": 760,
  "milestone": "WP-UI-FOUNDATION-01",
  "model_tier": "cheap",
  "risk": "medium",
  "architecture_impact": false,
  "executor_preference": "any",
  "depends_on": [
    "TASK-759"
  ],
  "context_paths": [
    "AGENTS.md",
    "docs/DOCUMENT_AUTHORITY.md",
    "docs/contracts/021-station-ui-foundation/ADDENDUM.md",
    "docs/adr/ADR-0017-station-visual-shell-foundation.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-F.md",
    "packages/station-editor/structure.ts",
    "apps/station/web/app/station-editor-catalog.ts",
    "apps/station/web/app/station-ui-foundation-candidates.ts"
  ],
  "allowed_paths": [
    "specs/tasks/TASK-760-UI-FOUNDATION-F-CHECKPOINT.md",
    "docs/current/NEXT_WORK.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-PLAN.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-F.md",
    "project_docs/execution_planning/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-F.report.md",
    "project_docs/evidence/ui-foundation-f/button-before.png",
    "project_docs/evidence/ui-foundation-f/button-after.png",
    "project_docs/evidence/ui-foundation-f/card-narrow-before.png",
    "project_docs/evidence/ui-foundation-f/card-narrow-after.png",
    "apps/station/web/app/station-ui-foundation-candidates.ts",
    "tests/product/station-ui-foundation-candidates.test.ts"
  ],
  "forbidden_paths": [
    "packages/**",
    "apps/station/web/app/station-editor-workbench.tsx",
    ".github/**",
    "runtime/**",
    "deploy/**"
  ],
  "max_files": 11,
  "validation": [
    "npm run check:docs",
    "node --import tsx tooling/agent-harness/src/cli.ts validate-tasks",
    "node --import tsx tooling/agent-harness/src/cli.ts architecture",
    "node --import tsx --test tests/product/station-ui-foundation-candidates.test.ts"
  ]
}
---
## Objective
Preserve actual before/after screenshots and a truthful partial F checkpoint, reconciling the independent live UI lane without displacing ICON.
## Context
Fresh main94da5ae2, planning1137 andC/D/E1141–1143 integrated; only openPR1144 is activeF. Owner explicitly requests each sprint evidence and current operational documentation. Existing NEXT_WORK UI lane mentions onlyA; factual implementation now exceeds it.
## Current behavior
Browser artifacts expire14 days, UI operational pointer is stale and F has no consolidated acceptance/gap report.
## Required change
After source gate observations, persist unmodified screenshot PNGs from actual GitHub browser artifacts, with head/run/path/hash provenance. Record qualified bounded source work, pending main integration, local verify restriction, failures/fixes and remaining F/WP gaps. Update only independent UI lane in NEXT_WORK; preserve primary ICON/WP02 scheduling text byte-for-byte. Existing plan receives chronological F checkpoint, not false sprint closure.
## Inputs / contracts
Actual PR states, exact-head workflows, browser logs/artifacts and current source contracts.
## Outputs / contracts
Durable visual evidence, factual status and one live pointer. No source behavior change.
## Acceptance criteria
Before/after screenshot review supports the reported changes; current source gates/results identified precisely; no source-only control promoted ready, no F/WP closure or successor sprint started. No operational-pointer collision with another open worker.
## Non-goals
Source code, ICON scope or WP02 priority changes, generic property/schema implementation or sprint closure.
## Evidence expected
Preserved PNG hashes/provenance, qualified source browser counts, all triggered final-head checks and report.
## Escalation
Stop for NEXT_WORK ownership conflict, branch lease mismatch or unqualified source evidence.

## Admission-state reconciliation
Bounded two-path extension before editing: Button candidate now has actual qualified registry/preview/round-trip proof. Align its census to INSERTABLE with primary component:button/composition:example mapping, matching Card; preserve source-only states for the five other families. This changes admission metadata only; category fallback already yields Actions, structural eligibility and rendering are unchanged. Neither candidate becomes EDITOR_READY before main integration. Eleven exact files maximum.
