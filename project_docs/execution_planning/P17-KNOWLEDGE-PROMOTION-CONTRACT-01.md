# P17-KNOWLEDGE-PROMOTION-CONTRACT-01

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Date: 2026-08-27
Package: `P17-PACKAGE-03 — Knowledge Promotion Control & Provenance`
WBS: 17.3.1–17.3.3
Intended base: `55f04ac98aa023270cf83163f4da06cf38272a5e`
Branch: `sprint/P17-KNOWLEDGE-PROMOTION-CONTRACT-01`

## Sprint Goal
Define deterministic, payload-minimal promotion-control contracts for permitted anonymization/generalization, explicit genericity review/test evidence and human-authoritative promotion/rejection provenance, composed with the closed WBS 17.1/17.2 truth.

## Committed TASKs / dependency order
1. TASK-379 — promotion candidate reference and transformation descriptor.
2. TASK-380 — permitted anonymization/generalization result contract. Depends on TASK-379.
3. TASK-381 — genericity review/test evidence contract. Depends on TASK-380.
4. TASK-382 — promotion/rejection decision and provenance contract preserving M15 human authority. Depends on TASK-381.
5. TASK-383 — deterministic composition with closed WBS 17.1/17.2 predecessor truth. Depends on TASK-379..382.
6. TASK-384 — integrated growing proof and Sprint Report. Depends on TASK-383.

## Predecessor gate
`P17-PACKAGE-02 / WBS 17.2.1–17.2.3` must remain canonically CLOSED. Existing enforcement/eligibility semantics remain unchanged; `eligible` is never approval. M15 `human-decision` authority must remain canonical.

## Growing proof expected at exit
A closed WBS 17.1 classification/use-policy decision and WBS 17.2 enforcement/eligibility state produce a payload-minimal candidate; permitted transformation and genericity evidence are explicit; invalid/unknown/mismatched state fails closed; final promotion/rejection provenance is tied to canonical human authority; no automated artifact grants promotion.

## Final validation
`npm run verify`

## Stop / escalation
Stop for Decision Boundary public-contract change, undeclared L4 architecture change, sensitive payload carriage, unrelated findings/TD absorption, or any requirement to treat transformation/testing/probabilistic output as promotion authority.