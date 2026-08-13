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

## R8 — Lightweight import scanner blind spots

The M0 gate scans static imports and known package aliases; it is not yet a full workspace dependency graph. Mitigation: self-tests now, then replace/augment it with package-manager-aware graph analysis when real packages exist.

## R9 — Narrative state drift

`task:close` updates task status, durable evidence and `TASK_LEDGER.json`, but intentionally does not rewrite narrative project documents. Mitigation: state-doc updates remain explicit acceptance criteria at milestone transitions and reviews compare prose to the ledger.

## R10 — Platform-specific bootstrap evidence

Initial verification targets Windows with Node 24/npm 11. Mitigation: add Linux/macOS CI only after local-first M1 is stable; do not claim unverified portability meanwhile.

## R11 — Local Git delivery metadata

Task/branch association and pre-closure Git metadata live under ignored `.agent/git/` so credentials and transient state are never committed. A lost workstation may require reconstructing the association from the deterministic branch name and GitHub PR. Durable metadata is written at task closure.

## R12 — Post-merge state update

Git-managed closure occurs after the implementation PR is merged, so `task:close` produces a small second set of versioned state changes. Mitigation: integrate it through a reviewed state-update commit/PR; no direct protected-main commit or hidden automatic merge is performed.

## R13 — Dual state authority during I2 transition

The bootstrap task catalog/ledger and pure AgentFactory ledger receipts are separate representations. Mitigation: the I2 coordinator must reconcile them after every state-closure merge and stop on divergence; no silent source-of-truth replacement is allowed.

## R14 — Incomplete provider economics

Token/provider cost is nullable because current adapters do not expose trustworthy usage observations. Mitigation: retain null rather than estimate; add accounting only from authoritative provider output.
