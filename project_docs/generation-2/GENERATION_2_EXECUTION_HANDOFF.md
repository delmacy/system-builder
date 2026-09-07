# Generation 2 — Execution Handoff

Status: EXECUTION AUTHORIZED / G2-WP-01 SELECTED / CONSTRUCTION A MATERIALIZED
Date: 2026-09-07
Fresh-main planning base: `d8760c7f08757bb164a758ae0c3f0a4a1752464b`
Planning-source branch revalidated: `research/g2-capability-pipeline` at `2ef10187d691666b45cba5978671570f0ff90c2a`

## Authority transition
The Generation 2 research/planning pipeline reached `READY_FOR_WORKER_HANDOFF` after Research/Synthesis, Planning A-E, Architecture Reconciliation, WBS Decomposition, WBS Dependency Graph, Work Package Design and worker handoff all CLOSED/PASS. The repository owner subsequently authorized execution of the designed `G2-WP-01..G2-WP-13` program under existing rolling-wave, dependency, review, L3/L4, safety and closure gates.

This authorization enables Planning & Materialization and eligible Construction/review/closure transitions inside the designed Work Packages. It does not convert forecasts into committed work, bypass predecessor/readiness gates, authorize undeclared L4 changes, absorb unrelated findings/debt or weaken security/governance/architecture constraints.

## Current commitment horizon
Only the following work is selected/materialized by this handoff:

- Work Package: `G2-WP-01 — Semantic Constitution & Federated Revision Base` — ACTIVE / PLANNED.
- Planning Sprint: `G2-WP01-PLANNING-MATERIALIZATION-01` — ACTIVE on its planning branch.
- First Construction Sprint: `G2-SEMANTIC-CONTRACT-FOUNDATION-01` — COMMITTED / MATERIALIZED / NOT EXECUTED.
- Committed TASK set for Construction A: `TASK-463..TASK-468`.

`G2-WP-02..G2-WP-13` remain DESIGNED / NOT MATERIALIZED. Construction B of WP-01 remains FORECAST. Construction C remains OPTIONAL / FORECAST.

## Planning authorities carried forward
Workers must revalidate the authoritative G2 planning source when beginning or promoting work, especially:

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`;
- `project_docs/generation-2/wbs/GENERATION_2_WBS_DECOMPOSITION.md`;
- `project_docs/generation-2/wbs/GENERATION_2_WBS_DEPENDENCY_GRAPH.md`;
- `project_docs/generation-2/packages/GENERATION_2_WORK_PACKAGE_DESIGN.md`;
- `project_docs/generation-2/packages/GENERATION_2_READY_FOR_WORKER_HANDOFF.md`;
- relevant Planning C/D/E capability decisions and proof obligations.

The research branch remains planning-source history; product execution branches must begin from fresh `main` and persist the bounded execution authority needed by committed Sprints in local repository memory.

## Constitutional carry-forward
- preserve 28 canonical capability ownership boundaries;
- Typed Semantic Graph is a portable structural composition model, not a universal domain model or GraphDB mandate;
- `CanonicalSemanticIdentity != Provider/External/RuntimeRealizationIdentity`;
- producing revisions/history are immutable and current qualification cannot rewrite them;
- `provenance != truth != currentness != authority`;
- `AI inference/proposal != authority`;
- `PARTIAL/UNKNOWN` remain explicit; unsafe mutating `UNKNOWN` routes to reconciliation before retry where applicable;
- source-of-truth movement is explicit coexistence/cutover/fencing/residual drainage, never latest-wins;
- provider/API parity is not semantic equivalence/admission/authority;
- local/Station/Fleet truth and currentness remain separately qualified;
- Physical/Peripheral remains in the bounded integration/governance plane with no generic direct actuation authority;
- Product Proof and Production Readiness Coverage remain distinct;
- `Research != remediation`, `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`.

## Execution protocol
Follow `AGENTS.md`, `SPRINT_GENERATION_POLICY.md` and `SPRINT_MODE.md`. Only the active Sprint is committed. Every Construction Sprint uses one `sprint/<SPRINT-ID>` branch, committed TASKs in dependency order, one authoritative commit per TASK, declared validations, growing proof, repository-wide verification, one PR and exact-head CI/review before integration.

After each merge reconstruct fresh `main` before promoting at most one successor Sprint. Construction C is promoted only when fresh evidence proves it necessary. Package Review and Documentation/Closure cannot hide missing product implementation.

## Current next action
Integrate the Planning & Materialization Sprint. Then reconstruct fresh `main`; if no superseding authority/blocker exists, create `sprint/G2-SEMANTIC-CONTRACT-FOUNDATION-01` from that exact main and execute `TASK-463 -> TASK-468`. Do not start Construction B in the same promotion action.