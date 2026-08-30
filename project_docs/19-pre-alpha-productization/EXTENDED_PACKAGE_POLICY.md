# M19 Extended Work Package Policy

Status: PROPOSED BASELINE / effective only when integrated
Applies only to: `P19-PACKAGE-01 — Consolidated Pre-Alpha Productization`

## Decision
For M19 only, the remaining pre-alpha work is intentionally consolidated into one outcome-owned extended Work Package rather than split into multiple artificial package boundaries.

The authorized forecast topology is:

`Planning & Materialization -> Construction 1 -> Construction 2 -> Construction 3 -> Construction 4 -> Construction 5 -> Construction 6 -> Construction 7 -> Construction 8 -> Package Integration & Product/Technical Acceptance -> Documentation & Closure`

The eight Construction Sprints are a maximum forecast topology, not a quota and not automatic execution authority. Fresh-main evidence may collapse adjacent forecast slices or determine that a forecast Construction Sprint is unnecessary. Additional construction beyond these bounded M19 outcomes requires change control rather than silent extension.

## Relationship to repository policy
`project_docs/schedule/SPRINT_GENERATION_POLICY.md` remains the default authority for ordinary new Work Packages. This file records an explicit, milestone-bounded exception for the terminal pre-alpha consolidation Package and does not amend the global default cadence.

All other policy invariants remain mandatory:
- rolling-wave planning;
- forecast is never execution authority;
- only the next eligible Sprint is promoted/materialized;
- fixed committed Sprint goal/manifest/TASK set;
- dependency-safe TASK decomposition and bounded allowed/forbidden paths;
- exact-head Deterministic CI and applicable Heavy Product Tests;
- fresh-main predecessor revalidation before successor commitment;
- Package Review cannot hide missing construction;
- Documentation & Closure introduces no product behavior;
- L4/architecture invalidation requires ADR/change control.

## TASK count
The user's planning example of approximately 20 TASKs per Sprint is capacity guidance only. It is neither a minimum nor a target. Materialization must choose the smallest auditable dependency-safe TASK set; no filler TASKs may be created to satisfy a numerical shape.

## Predecessor and activation
This exception cannot activate while `P18-PACKAGE-03`/M18 remains open. After canonical M18 closure, a fresh-main Planning & Materialization gate must revalidate this baseline against integrated truth and may then materialize only the first eligible M19 Construction Sprint.

## Closure
The exception expires automatically when `P19-PACKAGE-01` closes. Future milestones/Packages revert to the repository default cadence unless separately authorized and recorded.
