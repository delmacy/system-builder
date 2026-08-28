# P18-PROCESS-SEMANTIC-CHANGE-CONTRACT-01 — Construction A

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Work Package: `P18-PACKAGE-02 — Semantic Process Change Classification & Approval Evidence`
Base: `e205683422907edf8c27f99c01aab317cca3f66c`
WBS: 18.2.1–18.2.3

## Goal
Establish the minimum public contract/evidence foundation for semantic process change between canonical WBS 18.1 revisions, explicit classification, reason/evidence, and human-authoritative process-change approval/rejection.

## TASK chain
`TASK-399 -> TASK-400 -> TASK-401 -> TASK-402 -> TASK-403`

- TASK-399 — deterministic semantic diff descriptor/calculation over payload-minimal semantic snapshots tied to canonical revision endpoints.
- TASK-400 — explicit breaking/non-breaking/not-applicable classification evidence, kept non-authoritative for approval.
- TASK-401 — reason/evidence record bound to the exact diff/classification/revision references.
- TASK-402 — process-change approve/reject decision requiring canonical `human-decision` authority and explicit authorityRef match; no Decision Boundary change.
- TASK-403 — integrated growing proof for WBS 18.2 contracts and bypass resistance.

## Boundaries
Construction A may add a new additive/backward-compatible public process-change contract surface and TypeScript alias as explicit L3 work. It must consume WBS 18.1 predecessor truth rather than duplicate it. It may consume the existing Decision Boundary contract but may not modify it.

ADR-0010 durable PR approval is engineering-governance evidence and is not process-change business approval. No deterministic/probabilistic/model output may become approval merely by being a valid classification result.

## Exit proof
TASK-399..403 complete serially with declared validations; growing product proof covers positive composition and negative forged/mismatched/substitution/injection paths; exact-head Deterministic CI + Heavy Product Tests pass on implementation and lifecycle/report head before Sprint Review/integration.