# Current Execution Milestone — M10 P10 Direction Selection & Construction

## Goal

Close the production credentials blocker `TD-P4-05` via a production-grade, replaceable SecretResolver, and close `TD-P8-02` via positive TLS server-identity verification under the human-accepted ADR-0015. The first construction Sprint `P10-PRODUCTION-SECRETRESOLVER-01` is implemented, CI-validated and **merged** through PR #201; the second construction Sprint `P10-TLS-SERVER-IDENTITY-01` is implemented, CI-validated and **merged** through PR #214. P10 is package-complete; the Integration & Technical Debt Review is pending on `review/P10-PACKAGE-01-integration-debt`.

## Integrated predecessor

`P10-PRODUCTION-SECRETRESOLVER-01` merged through PR #201 at `4301936` (Deterministic CI run `32136056276` PASS on closure head `a1e0ed6`). `P10-TLS-SERVER-IDENTITY-01` merged through PR #214 at `3fdfb95` (Deterministic CI run `32248430431` PASS). `TD-P4-05` and `TD-P8-02` are both closed.

## Direction selection (from integrated evidence)

Selected: **A — Production SecretResolver + TLS/server-identity hardening** (`TD-P4-05` + `TD-P8-02`).

- The P9 review ranked this HIGH security importance and `READY TO BE CONSIDERED`, naming it the principal production blocker.
- B (Observe publication, `TD-P7-03`/WBS 10.3.3) retained as MEDIUM forecast.
- C (milestone pivot, `TD-P9-01`/`TD-P9-02`) not assumed; requires explicit milestone re-scope.

## Governance escalation (resolved)

`TD-P8-02` (positive TLS identity/certificate verification; removing `rejectUnauthorized: false`) is an **L3/L4-adjacent security-policy change** and was escalated to an ADR. **ADR-0015 is accepted by a human** through PR #206 (`docs/adr/ADR-0015-tls-server-identity-verification.md`, Status: Accepted), which authorizes Construction Sprint 2 bounded to the PostgreSQL transport and its rendered Runtime counterpart and their tests/docs.

## Constructed first construction Sprint

`P10-PRODUCTION-SECRETRESOLVER-01` — PASS, **MERGED** through PR #201 at `4301936`.
- Goal: production replaceable SecretResolver providers, fail-closed, no value leakage, managed-Runtime integration proof (`TD-P4-05`, L2/L3).
- Committed TASKs: TASK-128 (providers `d39d1fb`), TASK-129 (fail-closed/no-leakage `f153e8d`), TASK-130 (managed-Runtime E2E `a1e0ed6`).
- Branch: `sprint/P10-PRODUCTION-SECRETRESOLVER-01`; PR #201 merged.

## Constructed second construction Sprint

`P10-TLS-SERVER-IDENTITY-01` — PASS, **MERGED** through PR #214 at `3fdfb95`.
- Goal: positive PostgreSQL TLS server-identity verification (`verify-ca`/`verify-full`) in the shared transport and the rendered autonomous Runtime, fail-closed, closing `TD-P8-02` under ADR-0015.
- Committed TASKs: TASK-131 (`528c92e`), TASK-132 (`36dbe3a`), TASK-133 (`ae17052`).
- Branch: `sprint/P10-TLS-SERVER-IDENTITY-01`; PR #214 merged.

## Current gate

**Package complete; review pending.** `TD-P4-05` and `TD-P8-02` are closed; both P10 construction Sprints are merged. The Integration & Technical Debt Review is **PENDING** on `review/P10-PACKAGE-01-integration-debt` (PR pending). The successor `P11-PACKAGE-01` (Observe/operations publication, WBS 10.3.3, `TD-P7-03`/`TD-P4-08`) is materialized as a **planning skeleton only**; it becomes READY_TO_BE_PLANNED only after the review merges and is revalidated. No construction Sprint is authorized until then.
