# P7-DURABLE-DEPLOYMENT-E2E-01 — Sprint Report

Status: READY_FOR_SPRINT_REVIEW_AFTER_CLOSURE_CI
Base: `991c6cff2f2e7fc332b4534091ad6afafce14106`
Branch: `sprint/P7-DURABLE-DEPLOYMENT-E2E-01`
PR: #186

## Result

PASS, subject only to the final closure-head repository verification.

The Sprint proves:

`durable Factory output -> durable Deploy activation A -> autonomous Runtime -> successful B activation -> failed candidate C -> reconstruct deployment authority -> B remains active + Runtime continuity`

## TASK results

| TASK | Result | Commit | Objective validation |
| --- | --- | --- | --- |
| TASK-107 | PASS | `94a21fc6c2068968cfb036f9af91814fee58d58d` | Deterministic CI #322 PASS |
| TASK-108 | PASS | `f0788f36512dfd398acd7b36214c39348f925c61` | Deterministic CI #323 PASS |
| TASK-109 | PASS | `9bcd7e88a5e4190cc0935c43e5279437f9a1d679` | Deterministic CI #324 PASS |

## Evidence

- TASK-107 reconstructs Catalog and Release/Artifact through PostgreSQL, activates A through the durable Deploy provider, reconstructs active A and runs the verified artifact with Builder/Observe endpoints unavailable.
- TASK-108 introduces a real durable PublishedRelease B, executes it, promotes it over A, reconstructs B as active while retaining A history, and proves Runtime health.
- TASK-109 introduces a real durable PublishedRelease C, produces C failure from actual `dryRunDeploy` acceptance checks, records deterministic `retained-active` evidence, reconstructs A/B/C with B active, reproduces the same decision for C, and executes B again after C fails.
- Evidence serialization checks exclude the PostgreSQL URL/provider connection material and resolved secret values.

## Validation notes

Initial Sprint materialization CI #320 failed before TASK execution because TASK-107 omitted required catalog headings `Context` and `Evidence expected`. TASK-107/108/109 specs were normalized in materialization repair `9e678bc53e376205fa9897bfa311bb254fa6e6bc`; CI #321 PASS. This is a planning/materialization correction, not a product failure.

No local validation is claimed. GitHub Actions PostgreSQL 17.6 provides objective validation.

## Scope / architecture

This Sprint is evidence-only after materialization. No `packages/**`, canonical contracts, ADRs, Runtime implementation, PostgreSQL provider/schema/interface, CI workflow or production deployment infrastructure changed. ADR-0002 and ADR-0007 remain preserved.

## Residual work

All three P7 construction Sprints are now implemented on their respective branches/PR history, but this Sprint is not yet merged. The mandatory `P7 Integration & Technical Debt Review` remains FORECAST / NOT_MATERIALIZED and must not begin until this Sprint passes review and merge.

Existing PostgreSQL transport hardening debt remains outside this Sprint.

## Review boundary

After the closure-head Deterministic CI passes, mark PR #186 Ready for human Sprint Review and stop. Do not merge #186 and do not materialize the P7 Integration & Technical Debt Review without new authorization.