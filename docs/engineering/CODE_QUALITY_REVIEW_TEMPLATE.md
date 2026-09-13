# Code Quality Review Template

Use this template at Package Integration & Review or another explicitly chosen quality-review boundary.

## Review identity

- Repository SHA:
- Generation / Work Package:
- Sprint boundary:
- Review date:
- Reviewer:
- Compared baseline:

## Hard gates

- [ ] Declared CI/validation gates green
- [ ] No unresolved architecture/dependency violation
- [ ] No unapproved L3/L4 contract or architecture change
- [ ] No unsafe strengthening of UNKNOWN/PARTIAL/stale/provider-local evidence
- [ ] Historical revision/provenance remains preserved
- [ ] No unsafe retry of ambiguous mutating outcomes
- [ ] Known adversarial proof obligations covered
- [ ] Review findings have explicit disposition

Hard-gate disposition: `PASS | FAIL`

## Dimension scores

| Dimension | Weight | Score 0–10 | Evidence / notes |
| --- | ---: | ---: | --- |
| Architecture & boundaries | 20% |  |  |
| Type safety | 12.5% |  |  |
| Tests & Product Proof | 17.5% |  |  |
| Determinism & fail-closed behavior | 12.5% |  |  |
| Readability | 10% |  |  |
| Reuse & duplication control | 10% |  |  |
| Complexity & maintainability | 7.5% |  |  |
| CI & operational engineering | 10% |  |  |

Weighted score:

Classification: `GREEN | GREEN-WATCH | YELLOW | ORANGE | RED`

## Delta from previous baseline

- Weighted-score delta:
- Dimensions improved:
- Dimensions degraded:
- Any dimension drop >= 1.0:
- Any repeated-below-7.0 dimension:

## Evidence sampled

Record representative repository evidence rather than attempting to inspect every file.

- Contracts/modules sampled:
- Product/unit/integration tests sampled:
- CI/architecture evidence:
- High-change or large files sampled:
- Cross-package reuse checked:
- Duplicate helper/semantic searches:
- Unsafe casts / generic-reference hotspots:

## Strengths preserved or improved

- 

## Hotspots / findings

| Finding | Severity | Evidence | Disposition | Owner / target boundary |
| --- | --- | --- | --- | --- |
|  |  |  | `FIX_NOW | NEXT_PACKAGE | CROSS_CUTTING_REFACTOR | ACCEPTED_BOUNDED_DEBT` |  |

## Cross-cutting watchlist check

- [ ] repeated non-empty/time/currentness helpers
- [ ] duplicated evidence-completeness vocabulary
- [ ] generic string identifiers that should become stronger reference types
- [ ] ad-hoc structural equality/serialization comparison
- [ ] constant-return invariant proof functions proliferating
- [ ] contract files accumulating unrelated responsibilities
- [ ] provider/revision/provenance semantics duplicated instead of composed

## Decision

Overall quality disposition:

`PASS | PASS_WITH_WATCH_ITEMS | BOUNDED_REPAIR_REQUIRED | QUALITY_GATE_FAIL`

Required action before next dependency-safe Work Package:

- 

Next quality review boundary:
