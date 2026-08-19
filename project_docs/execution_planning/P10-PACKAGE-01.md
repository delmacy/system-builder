# P10-PACKAGE-01 — Production Credentials & Connectivity Hardening

Status: COMMITTED / DIRECTION_SELECTED / SPRINT_1_MERGED / SPRINT_2_BLOCKED
Base SHA: `6279b98f14a11ce22bddfd2702f77bd574466d6d` (main reconstruído após PR #199)
Milestone: M10

## Authority

Materialized from the `P10-PACKAGE-01` planning skeleton (FORECAST) after the P9 Integration & Technical Debt Review merged to `main` (`898a14f`), `main` was freshly reconstructed (`6279b98`), and successor readiness was revalidated from repository truth.

Selection of direction is made from integrated evidence (P9 review successor-readiness ranking). **This package authorizes only the first construction Sprint manifest and its committed TASK specs; no product construction is authorized before that Sprint's manifesto is satisfied and the construction Sprint is executed on its own branch.**

`P10-PRODUCTION-SECRETRESOLVER-01` executed on `sprint/P10-PRODUCTION-SECRETRESOLVER-01` and **merged through PR #201 at `4301936`**, closing `TD-P4-05`.

## Package Goal

Close the two principal production blockers that gate production credentials and PostgreSQL connectivity while preserving Runtime autonomy (ADR-0002) and the no-value-leakage invariant (ADR-0007):

- `TD-P4-05` — production SecretResolver providers absent;
- `TD-P8-02` — positive TLS identity/certificate verification not proven.

## Selected direction

**Direction A — Production SecretResolver + TLS/server-identity hardening.**

Rationale from integrated evidence:
- The P9 Integration & Technical Debt Review ranked this as the successor candidate of HIGH security importance and `READY TO BE CONSIDERED`, and named `TD-P4-05` + `TD-P8-02` as the principal production blockers.
- Direction B (Observe publication, `TD-P7-03`/WBS 10.3.3) remains MEDIUM priority and independently plan-able under ADR-0002; it is retained as a forecast successor but not selected first.
- Direction C (milestone pivot, `TD-P9-01`/`TD-P9-02`) requires explicit milestone re-scope and cannot be assumed; it is not selected here.

## Package decomposition (rolling wave)

### Construction Sprint 1 — `P10-PRODUCTION-SECRETRESOLVER-01` (MERGED / CLOSED)
- Goal: add production-grade replaceable SecretResolver providers (process-environment and file-backed) with deterministic fail-closed resolution, no value leakage, and managed-Runtime integration proof.
- Carried driver: `TD-P4-05` (L2/L3, no ADR required).
- Result: PASS; merged through PR #201 at `4301936` (Deterministic CI run `32136056276` on head `a1e0ed6`).

### Construction Sprint 2 — TLS/server-identity hardening (FORECAST, not committed) — **BLOCKED**
- Carried driver: `TD-P8-02`.
- **Governance escalation:** removing `rejectUnauthorized: false` / adding positive CA/server-identity verification is an L3/L4-adjacent security-policy change. Per Sprint Mode it must be escalated to an ADR and accepted by a human before any construction. This package does **not** invent that policy; it registers the escalation and keeps the Sprint in FORECAST.
- **Current blocker:** after revalidating from fresh `main` (`4301936`), no TLS/server-identity ADR is accepted in the repository (`docs/adr/` contains ADR-0001..ADR-0014 only). Construction Sprint 2 is **BLOCKED**; it will not be promoted/materialized and no TLS policy change may be started until the `TD-P8-02` ADR is accepted by a human and `main` is freshly reconstructed.

### Package Integration & Technical Debt Review (FORECAST)
- Mandatory package review after the construction Sprints merge, per `SPRINT_GENERATION_POLICY`.

## Growing E2E proof (package horizon)

`durable Catalog -> Assembly -> Validation -> Compiler -> durable Release/Artifact -> managed A -> authority A -> ... -> production SecretResolver resolves symbolic secret references into the managed Runtime process environment with no value leakage into durable Release/Deployment evidence -> Runtime continuity with Builder/Observe unavailable`

## Candidate selection gate

Direction and construction-Sprint readiness were revalidated from repository truth after the review merge and `main` reconstruction. Selection is complete; only Sprint 1 is committed (and now MERGED). Sprint 2 remains FORECAST / **BLOCKED** pending the TLS ADR.

## Non-commitment notice

This package commits only the direction and the first construction Sprint manifest + TASK specs. It does not authorize product implementation, the TLS policy change, or Sprint 2 construction. The TLS Sprint requires a human-accepted `TD-P8-02` ADR; that gate is not substituted or converted into authorization by this package.
