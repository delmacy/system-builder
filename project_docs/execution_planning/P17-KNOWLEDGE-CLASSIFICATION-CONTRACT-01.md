# P17-KNOWLEDGE-CLASSIFICATION-CONTRACT-01

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Package: `P17-PACKAGE-01 — Knowledge Classification & Use Policy Foundation`
WBS: 17.1.1–17.1.3
Intended base: fresh `main` after Planning & Materialization integration
Branch: `sprint/P17-KNOWLEDGE-CLASSIFICATION-CONTRACT-01`

## Sprint Goal
Establish provider-neutral, fail-closed contracts for knowledge class, ownership, purpose/use restrictions and manual/assisted classification decisions, with explicit evidence that probabilistic assistance cannot itself classify, authorize reuse or promote content.

## Authoritative TASK sequence
1. TASK-355 — canonical knowledge class and ownership descriptor.
2. TASK-356 — purpose/use restriction contract.
3. TASK-357 — manual/assisted classification decision record.
4. TASK-358 — deterministic validation and canonical normalization.
5. TASK-359 — assisted-classification proposal boundary and human-decision linkage.
6. TASK-360 — classification evidence/reference projection without sensitive payload carriage.
7. TASK-361 — growing integrated proof and Sprint Report.

Dependency graph:
`TASK-355 -> {TASK-356, TASK-357} -> TASK-358`; `TASK-357 -> TASK-359`; `{TASK-358, TASK-359} -> TASK-360 -> TASK-361`.

## Predecessor gate
Planning & Materialization PR must integrate on fresh main with exact-head Deterministic CI + Heavy Product Tests PASS. No TASK execution before that integration.

## Growing integration proof at exit
- all four canonical knowledge classes are explicit and normalized;
- owner/ownership scope is explicit rather than inferred from payload/source names;
- purpose/use restrictions are portable and deterministic;
- manual classification is explicit;
- assisted classification remains a proposal until explicit human decision, compatible with the Decision Boundary principle that probabilistic output is not authority;
- invalid/unknown/extra fields fail closed;
- evidence/reference projection never requires sensitive payload carriage;
- no WBS 17.2 enforcement or WBS 17.3 promotion behavior exists.

## Final validation
`npm run verify` plus exact-head Heavy Product Tests on the Sprint PR.

## Stop / escalation
Stop for undeclared L4, required changes outside TASK allowed paths, any need to make assisted/probabilistic output authoritative, or any requirement to implement enforcement/promotion from WBS 17.2/17.3.
