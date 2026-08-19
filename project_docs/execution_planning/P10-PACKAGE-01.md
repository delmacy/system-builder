# P10-PACKAGE-01 — Production Credentials & Connectivity Hardening

Status: COMMITTED / DIRECTION_SELECTED / SPRINT_1_MERGED / SPRINT_2_COMMITTED
Base SHA: `e9f1b4d` (main reconstruído após PR #212; revalidated after the real Sprint 1 merge)
Milestone: M10

## Authority

Materialized from the `P10-PACKAGE-01` planning skeleton (FORECAST) after the P9 Integration & Technical Debt Review merged to `main` (`898a14f`), `main` was freshly reconstructed (`6279b98`), and successor readiness was revalidated from repository truth.

Selection of direction is made from integrated evidence (P9 review successor-readiness ranking). The package authorizes the construction Sprint manifests and their committed TASK specs; no product construction is authorized before each Sprint executes on its own branch.

- Sprint 1 `P10-PRODUCTION-SECRETRESOLVER-01` executed on `sprint/P10-PRODUCTION-SECRETRESOLVER-01` and **merged through PR #201 at `4301936`**, closing `TD-P4-05`.
- Sprint 2 `P10-TLS-SERVER-IDENTITY-01` is **COMMITTED** (manifest + TASK-131/132/133 specs) after the `TD-P8-02` ADR (ADR-0015) was accepted by a human through PR #206. No product construction is performed inside this planning transition.

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

### Construction Sprint 2 — TLS/server-identity hardening (COMMITTED / MATERIALIZED)
- Carried driver: `TD-P8-02`.
- **Governance escalation resolved:** removing `rejectUnauthorized: false` / adding positive CA/server-identity verification is an L3/L4-adjacent security-policy change. It was escalated to **ADR-0015**, which is now **accepted by a human** through PR #206 (`docs/adr/ADR-0015-tls-server-identity-verification.md`, Status: Accepted).
- **Unblocked after revalidation:** ADR-0015 authorizes this Sprint bounded to the PostgreSQL transport and its rendered Runtime counterpart and their tests/docs. Construction Sprint 2 `P10-TLS-SERVER-IDENTITY-01` is now **COMMITTED** (manifest `project_docs/execution_planning/P10-TLS-SERVER-IDENTITY-01.md` + TASK-131/132/133 specs). No product construction happens inside this planning transition.

### Package Integration & Technical Debt Review (FORECAST)
- Mandatory package review after the construction Sprints merge, per `SPRINT_GENERATION_POLICY`.

## Growing E2E proof (package horizon)

`durable Catalog -> Assembly -> Validation -> Compiler -> durable Release/Artifact -> managed A -> authority A -> ... -> production SecretResolver resolves symbolic secret references into the managed Runtime process environment with no value leakage into durable Release/Deployment evidence -> Runtime continuity with Builder/Observe unavailable -> shared Transport and rendered Runtime perform positive PostgreSQL TLS server-identity verification (verify-ca/verify-full, fail-closed) -> authenticated SCRAM positive-verification E2E`

## Candidate selection gate

Direction and construction-Sprint readiness were revalidated from repository truth after the review merge and `main` reconstruction. Selection is complete; Sprint 1 is committed (and now MERGED). After the `TD-P8-02` ADR (ADR-0015) was accepted by a human, Sprint 2 was revalidated from fresh repository truth and is now committed (manifest + TASK-131/132/133 specs), unblocked.

## Post-merge revalidation

Revalidated after the real Sprint 1 merge (PR #201) from freshly reconstructed `main` (`e9f1b4d`, after PR #212). Sprint 2 `P10-TLS-SERVER-IDENTITY-01` remains the sole eligible committed successor (manifest + TASK-131/132/133, `ready`); the `TD-P8-02` gate is satisfied by human-accepted ADR-0015 (PR #206). No blocker, ADR, L3/L4, destructive-migration or security-weakening gate is present. This transition records the revalidation only; no product construction was performed. Re-confirmed on the post-credential-fix re-dispatch from freshly reconstructed `main` (`e9f1b4d`): Sprint 2 remains the sole eligible committed successor.

## Non-commitment notice

This package commits only the direction and the construction Sprint manifests + TASK specs. It does not authorize product implementation or Sprint 2 construction; the committed Sprint executes later on its own branch (`sprint/P10-TLS-SERVER-IDENTITY-01`) with its declared validations. The TLS policy decision is made by the human-accepted ADR-0015; this package did not substitute that gate.
