# Code Quality Baseline

Status: engineering governance reference.

This document defines the minimum code-quality baseline used to manage System Builder implementation quality over time. It does not override `AGENTS.md`, accepted ADRs, active Work Package/Sprint authority, TASK scope, or architecture boundaries. It exists to make quality drift visible early and to turn subjective review into repeatable engineering evidence.

## Objectives

The baseline must answer four questions:

1. Is the code still easy to understand and change?
2. Are architectural boundaries and semantic invariants still enforced by code and tests?
3. Is complexity accumulating faster than reusable primitives and abstractions?
4. Is a Work Package leaving behind debt that should be repaired before later packages depend on it?

A high aggregate score never overrides a hard failure. CI, architecture violations, unsafe semantic strengthening, unresolved review findings, or unapproved L3/L4 changes remain blockers regardless of score.

## Scored dimensions

Each dimension is scored from 0 to 10. Scores should be supported by repository evidence rather than intuition alone.

| Dimension | Weight | What is evaluated |
| --- | ---: | --- |
| Architecture & boundaries | 20% | bounded-context isolation, public-contract discipline, dependency direction, no hidden cross-module authority |
| Type safety | 12.5% | strict typing, avoidance of unsafe casts/`any`, explicit optionality, reference-type safety |
| Tests & Product Proof | 17.5% | positive, negative, adversarial, predecessor-integration and regression coverage |
| Determinism & fail-closed behavior | 12.5% | explicit UNKNOWN/PARTIAL handling, stable normalization, no silent fallback or latest-revision substitution |
| Readability | 10% | naming, function size, local comprehensibility, formatting, reviewability and diagnostic clarity |
| Reuse & duplication control | 10% | reuse of existing contracts/primitives, absence of duplicated currentness/time/provenance/equality logic |
| Complexity & maintainability | 7.5% | file/function growth, branching complexity, responsibility concentration, refactorability |
| CI & operational engineering | 10% | lint/typecheck/build/tests/architecture gates, deterministic CI and evidence quality |

Weighted score = sum of `(dimension score × weight)`.

## Health bands

| Weighted score | Classification | Expected action |
| --- | --- | --- |
| 8.5–10.0 | GREEN | healthy; continue and preserve trend |
| 7.5–8.49 | GREEN-WATCH | acceptable; record emerging hotspots |
| 6.5–7.49 | YELLOW | bounded debt plan required before dependency fan-out grows |
| 5.0–6.49 | ORANGE | corrective Sprint/refactor should precede additional broadening |
| < 5.0 | RED | quality gate failure; do not normalize as routine debt |

The weighted score is trend evidence, not a release substitute.

## Hard gates independent of score

A review cannot be classified GREEN while any of the following remains unresolved:

- repository-required CI or declared TASK validation is failing;
- a shared/public contract changed outside approved L3/L4 authority;
- architecture/dependency direction is violated;
- stale, PARTIAL, UNKNOWN or provider-local evidence is silently strengthened into authority;
- historical producing revision/provenance can be replaced by current/latest state;
- a mutating ambiguous outcome retries without required reconciliation;
- tests hide or omit a known negative/adversarial obligation;
- a review finding is deferred without explicit bounded debt ownership;
- documentation claims behavior not supported by integrated repository evidence.

## Review cadence

Quality is reviewed at four levels:

1. **TASK:** normal TASK validations and code review protect local quality.
2. **Construction Sprint Review:** inspect new hotspots when a Sprint adds a new semantic family or a high-risk implementation surface.
3. **Package Integration & Review:** mandatory quality delta against the previous Work Package baseline.
4. **Generation/release boundary:** broader cross-cutting review for duplicated primitives, package coupling and systemic refactoring opportunities.

Do not create a separate refactor merely because a score is not perfect. Prefer bounded repair when evidence shows real maintenance or correctness risk.

## Delta rules

At Package Integration & Review, compare with the previous accepted baseline.

Trigger a recorded quality finding when any of these occurs:

- weighted score drops by `>= 0.5`;
- any single dimension drops by `>= 1.0`;
- a dimension remains below `7.0` for two consecutive package reviews;
- the same helper/semantic rule is independently implemented in three or more bounded contexts;
- a file repeatedly grows because unrelated responsibilities are accumulating;
- repeated unsafe casts or generic string references begin bypassing type-level distinctions;
- review time is increasingly spent understanding formatting/density rather than semantics.

A finding may be `FIX_NOW`, `NEXT_PACKAGE`, `CROSS_CUTTING_REFACTOR`, or `ACCEPTED_BOUNDED_DEBT` with rationale.

## Evidence checklist

Use objective repository evidence where possible:

- `npm run verify` and exact-head CI status;
- TypeScript strictness and diagnostics;
- architecture checks and import/dependency boundaries;
- file/function size and responsibility concentration;
- repeated helpers or near-identical normalization logic;
- unsafe casts, `any`, unchecked deserialization and generic string identifiers;
- public-contract surface growth;
- Product Tests covering negative/adversarial cases;
- explicit error/reason codes and operational diagnostics;
- reuse of earlier capabilities rather than parallel reimplementation;
- unresolved TODO/FIXME/backlog findings relevant to code quality.

Metrics should reveal problems, not create gaming incentives. A 300-line coherent contract can be healthier than five artificially fragmented files.

## Preferred engineering direction

The baseline favors:

- small explicit contracts over implicit behavior;
- typed semantic distinctions over overloaded strings;
- shared primitives for currentness, provenance, temporal validation and structural comparison when their semantics are genuinely common;
- fail-closed handling of uncertainty;
- deterministic normalization and proofs;
- composition of capabilities already proven in prior Work Packages;
- reasoned diagnostics over opaque booleans for multi-cause failures;
- refactoring at natural package/generation boundaries instead of broadening active TASK scope.

## Cross-cutting watchlist

The following are current architectural watch items and should be checked repeatedly as G2 grows:

- repeated `nonEmpty` / timestamp / currentness helpers;
- duplicate evidence-completeness and reason-code vocabularies;
- generic `string` identifiers where branded/reference types could prevent category mistakes;
- structural equality implemented through ad-hoc serialization;
- invariant-proof functions that exist only to return a constant and may belong in a proof/assertion layer;
- large contract files accumulating multiple independent responsibilities;
- duplication of provider/evidence/revision semantics instead of composing common primitives.

These are watch items, not automatic defects.

## Quality review record

Each formal review should record:

- repository SHA and Work Package/Sprint boundary;
- dimension scores and weighted score;
- hard-gate status;
- evidence sampled;
- improvements since the previous baseline;
- regressions/hotspots;
- debt disposition and owner;
- next review boundary.

Use `docs/engineering/CODE_QUALITY_REVIEW_TEMPLATE.md` for package-level reviews and keep accepted snapshots under `docs/evidence/code-quality/`.
