# Current Risks

## R1 — Premature migration

Bulk-copying `gestaotecnica` would reintroduce old coupling. Mitigation: classification audit before extraction.

## R2 — Documentation without enforcement

Agents may violate principles despite docs. Mitigation: convert enforceable rules into architecture/scope tests during M0.

## R3 — Harness becomes a second product

Overbuilding dashboards/RAG/agent services delays System Builder. Mitigation: Markdown + schemas + small TypeScript scripts + Git first.

## R4 — Premium-token dependency

Routine work could become expensive. Mitigation: bounded deterministic tasks, context packs and model routing; free/cheap OpenCode execution is default.

## R5 — Local-only state loss

Desktop development can diverge or be lost. Mitigation: frequent coherent commits/pushes; GitHub is remote system of record.

## R6 — Architecture overdesign

Suite vision could encourage building all twelve products before proving value. Mitigation: architecture for expensive-to-change boundaries; implementation only for the next end-to-end proof.

## R7 — Lock-in accidentally reintroduced

Convenient internal coupling can contradict product philosophy. Mitigation: public contracts, autonomy tests, legacy coexistence tests and replaceability reviews.
