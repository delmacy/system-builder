# G2-WP-01 — Planning & Materialization

Status: `COMMITTED / PLANNING`

Base: `d8760c7f08757bb164a758ae0c3f0a4a1752464b` (fresh `main`)

Planning authority: exact reviewed `research/g2-capability-pipeline` revision `2ef10187d691666b45cba5978671570f0ff90c2a` at `READY_FOR_WORKER_HANDOFF`, specifically:

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`;
- `project_docs/generation-2/wbs/GENERATION_2_WBS_DECOMPOSITION.md`;
- `project_docs/generation-2/wbs/GENERATION_2_WBS_DEPENDENCY_GRAPH.md`;
- `project_docs/generation-2/packages/GENERATION_2_WORK_PACKAGE_DESIGN.md`;
- `project_docs/generation-2/packages/GENERATION_2_READY_FOR_WORKER_HANDOFF.md`.

Execution authorization: user-authorized `G2-WP-01..G2-WP-13`, bounded by the designed WPs/DAG and repository Sprint policy.

## Package goal

Deliver `G2-WBS-01` — the semantic substrate, revision and graph constitution required by later Generation 2 packages: stable semantic identity, typed graph semantics, immutable/historically addressable revision identity, population/locality-qualified currentness, evidence/provenance references, temporal coordinates, inter-system/federated graph semantics, and local/Station/Fleet truth boundaries.

## Constitutional invariants

- Typed Semantic Graph owners remain explicit; graph composition/transformation may not strengthen owner truth.
- Semantic identity must survive provider/external-ID churn.
- Revision identity is immutable and historically addressable; latest/current is not historical identity.
- Currentness is population/locality/revision qualified; `PARTIAL` and `UNKNOWN` remain first-class.
- Federation cannot strengthen remote claims; Fleet aggregation cannot replace local/Station truth.
- Evidence/provenance and AI-derived candidates never become authority by implication (`AI inference != authority`).
- No provider mechanics, domain authorization, workflow behavior, source-of-truth migration, generic physical actuation authority, or findings marked DEFER/DO_NOT_BUILD enter this package.

## Predecessor/readiness

- M19/P19 is canonically CLOSED / PRE-ALPHA on fresh main.
- Generation 2 planning pipeline is `READY_FOR_WORKER_HANDOFF` at the pinned authority revision above.
- `G2-WP-01` has no predecessor Work Package; Architecture/WBS planning chain is CLOSED/PASS.
- No open PR or same-head CI was present at planning start.

## Forecast

### Construction A — `G2-SEMANTIC-IDENTITY-REVISION-CONTRACT-01`
Goal: introduce the minimal public semantic constitution for stable semantic identity, immutable revision identity, typed node/edge ownership, evidence/provenance references and explicit currentness/locality states, reusing existing contracts/primitives where compatible.

Exit proof: positive construction and serialization; invalid/missing owner/revision/evidence/currentness inputs rejected; historical revision remains addressable after a successor revision exists; no provider/external ID becomes canonical identity; deterministic ordering/identity where applicable.

Status: `COMMITTED` (materialized below).

### Construction B — `G2-FEDERATED-GRAPH-CURRENTNESS-01`
Goal: compose local/Station/Fleet and inter-system/federated semantic graph views without authority strengthening, preserving revision/currentness/evidence qualification and `PARTIAL/UNKNOWN`.

Exit proof: remote/fleet composition cannot strengthen a source claim; stale/unknown/substituted predecessor revision remains visible; deterministic composition; missing dependency/evidence produces explicit non-authoritative state rather than invented truth.

Status: `FORECAST`.

### Construction C — candidate only
Candidate goal: bounded hardening only if fresh-main evidence after Construction B proves an unsatisfied G2-WBS-01 closure obligation. Not materialized and not presumed necessary.

Status: `FORECAST / OPTIONAL`.

### Package Integration & Review
Regress the complete G2-WBS-01 outcome against package closure obligations, architecture boundaries, contract compatibility, deterministic CI/heavy classification, technical debt, and successor prerequisites. No overflow feature work.

Status: `FORECAST`.

### Documentation & Closure
Reconcile repository memory, package evidence, WBS/DAG readiness and next eligible package(s). No product behavior.

Status: `FORECAST`.

## Growing package proof

A single proof chain must demonstrate that a semantic entity keeps stable canonical identity across revisions and external/provider identifiers; historical revisions remain addressable; typed edges preserve owner/evidence provenance; currentness is explicitly qualified by population/locality; and local -> Station -> Fleet / inter-system composition never strengthens source truth. The proof must include `PARTIAL`/`UNKNOWN`, stale/superseded revision and invalid boundary cases.

## Materialized first Construction Sprint

Sprint: `G2-SEMANTIC-IDENTITY-REVISION-CONTRACT-01`

Intended branch after Planning integration: `sprint/G2-SEMANTIC-IDENTITY-REVISION-CONTRACT-01` from fresh integrated main.

Committed TASK dependency order:

1. `TASK-G2-001` — repository archaeology and semantic primitive compatibility guard; document/reuse existing identity/revision/evidence/currentness primitives and add characterization tests where necessary. No public semantic expansion beyond the Sprint Goal.
2. `TASK-G2-002` — define stable semantic identity + immutable revision/currentness contract with explicit owner/locality/population/evidence qualification.
3. `TASK-G2-003` — define typed semantic node/edge contract and owner-preserving/non-strengthening validation rules.
4. `TASK-G2-004` — implement deterministic revision history/currentness resolution preserving historical addressability and `PARTIAL/UNKNOWN`.
5. `TASK-G2-005` — extend the real product proof across identity -> revision -> typed graph contract, including provider/external-ID churn, stale/superseded revision, invalid owner/evidence/currentness and no authority strengthening.

TASK specs are materialized under `specs/tasks/` and are authoritative for paths/file limits/validation before implementation.

Final Sprint validation: `npm run verify`; heavy tests apply only if the actual implementation crosses the repository heavy-test classifier boundary.

## Stop/escalation conditions

Stop Construction and require explicit architecture/change-control handling if implementation requires an undeclared L4 boundary change, a new canonical capability, Builder/Runtime topology change, generic physical actuation authority, destructive migration, security/governance weakening, or a contradiction between current product contracts and the G2 CLOSED/PASS architecture that cannot be resolved boundedly inside G2-WBS-01.