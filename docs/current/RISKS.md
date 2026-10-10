# Current Risks

Date: 2026-10-10

Horizon note: R1–R12 retain older P13 risk evidence; their task/sprint directives are historical context and do not select current work. No old risk/debt closure is implied. NEXT_WORK is the sole execution pointer.

This register tracks risks that are materially current for the integrated repository horizon. Historical bootstrap/AgentFactory risks belong in historical evidence, not in this current-state document.

## R1 — Authentication/authorization boundary collapse

P13 Package 02 introduces Runtime identity/auth/session execution before authorization execution. A successful authentication must never be interpreted as authorization. Mitigation: keep Construction A limited to WBS 13.2.1, fail closed, and require explicit later authorization semantics/proof.

## R2 — Identity or auth binding fails open

Unknown/disabled identity, malformed identity state, missing/incompatible provider binding, or invalid/expired session could accidentally produce an actor context. Mitigation: deterministic negative-path tests and fail-closed activation/request behavior.

## R3 — Secret/value leakage into durable evidence

Provider credentials, resolved values, session secrets/tokens or resolved endpoints could leak into Compiler artifacts, release/deploy evidence, logs or immutable records. Mitigation: preserve reference-only EnvironmentProfile/SecretResolver boundaries and test durable artifacts for absence of resolved sensitive values.

## R4 — Authentication contract expands beyond bounded L3 authority

TASK-231 authorizes only the minimum additive backward-compatible SystemDefinition identity/auth-provider/session semantics. A second shared-contract family, mandatory provider-specific IAM topology or ownership change would exceed that authority. Mitigation: stop and use explicit change control; L4 changes require ADR.

## R5 — Runtime autonomy regression

Identity/session work could reintroduce ordinary Runtime dependence on Builder or Observe. Mitigation: preserve Runtime autonomous operation and architecture dependency gates; external bindings must remain deployment/runtime concerns within accepted boundaries.

## R6 — Forecast scope pulled into committed construction

Authorization, roles/permissions/policies, generated views/forms, Construction C, package review/closure or P13-PACKAGE-03 could be absorbed prematurely into Construction A. Mitigation: execute only committed TASK-231..239 and revalidate fresh `main` before promoting successors.

## R7 — Carried Runtime debt obscured by new package work

`TD-P13-01..04` remain real debt from P13 Package 01, including job overlap/retry/idempotency, HTTP bounds, file hardening and generated Runtime maintainability. Mitigation: preserve explicit debt traceability and do not silently claim it closed or absorb it without WBS/dependency authority.

## R8 — Documentation/state authority drift

Historical bootstrap ledgers, handoffs or hosted-automation documents can contradict current repository memory and local-first execution policy. Mitigation: classify historical documents explicitly, keep `docs/current` limited to current truth, and resolve contradictory authority before execution.

## R9 — Documentation without enforcement

Narrative rules alone can drift from implementation. Mitigation: encode enforceable architecture/security/scope rules in deterministic checks where practical and require exact-head CI/review evidence at integration boundaries.

## R10 — Architecture overdesign and lock-in regression

Suite vision or convenient provider coupling could expand P13 beyond the next integrated proof or reintroduce lock-in. Mitigation: architecture only expensive-to-change boundaries, prefer additive/provider-neutral contracts, and implement only approved WBS/Work Package scope.

## R11 — Provider economics and operational observability remain incomplete

Provider cost/usage and some production-hardening signals may remain unavailable or nullable. Mitigation: record only authoritative observations; do not estimate facts or convert missing telemetry into false guarantees.

## R12 — Narrative repository memory can lag a just-completed gate

Repository-memory documents are intentionally reconciled at defined Sprint/package transitions rather than rewritten by every low-level action. Mitigation: after accepted integration, reconstruct fresh `main` and reconcile `PROJECT_STATE`, `CURRENT_MILESTONE` and `NEXT_WORK` before successor materialization/execution when policy requires it.

## Station S4 WP3 — current scoped dispositions

WP3 bounded delivery has integrated codec/file/local-store proof through #1046/#1047/#1048; closure becomes effective on validated documentation Sprint integration. No bounded goal blocker observed. Browser-native origin storage can be denied, quota-limited or cleared (WP3-L1); explicit portable files are the independent retained copy. Expected stored text prevents stale replacement but is not a cross-tab transaction (WP3-L2). Requested download is not proof of a filesystem receipt (WP3-L3).

Nonblocking backlog WP3-D1: corrupted/existing local slots are conservatively preserved; export current applied draft to a portable file when local recovery cannot open valid data. WP3-D2: synchronous bounded codec/storage/provenance growth needs quantitative proof before larger catalogs; 1 MiB/depth/node/token gates reject safely and no latency guarantee is claimed. Inherited minimized-mounted editor memory lifetime is unchanged. Structural authoring/File Manager/.process/Core/server/sync/deploy remain future admitted scope, not current defects or automatic successors. Detailed classifications: project_docs/execution_planning/STATION-S4-WP3-INTEGRATION-REVIEW-01.report.md.

## Station S4 WP4 bounded edit-history review — 2026-10-10
WP4-L1: ephemeral 50-entry history resets on successful checkpoint/open/reload/close; keep portable files for retention. WP4-L2: native text undo remains separate and unapplied fields/pending replacement block graph history without dropping input. Accepted product limits, not persistence promises.
WP4-D1: generated Playwright report JavaScript can pollute a later local repository lint scan; clean only disposable outputs. Ignored-output configuration improvement is a nonblocking backlog item outside this package's allowed paths. WP4-D2: whole-graph snapshot/validation cost is bounded for installed three-node examples; measure/revalidate before future structural or large-graph scope. No latency/universal accessibility certification.
A #1051 and B #1052 passed seven workflows, Windows/Ubuntu and actual Chromium proof (21 and 29 cases respectively). Optional C not necessary. WP3 residuals and unrelated historical debts remain unchanged; Package Review/Closure gates still control declaration.
