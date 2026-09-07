# G2-SEMANTIC-CONTRACT-FOUNDATION-01 — Construction A

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Work Package: `G2-WP-01 — Semantic Constitution & Federated Revision Base`
Planning base: `d8760c7f08757bb164a758ae0c3f0a4a1752464b`
Planning Sprint: `G2-WP01-PLANNING-MATERIALIZATION-01`
Intended Construction branch: `sprint/G2-SEMANTIC-CONTRACT-FOUNDATION-01`
WBS: `G2-WBS-01`

## Sprint goal
Establish the first executable Generation 2 semantic substrate as a small additive public contract family with explicit owner-qualified semantic identity, immutable revision qualification, temporal/currentness coordinates, typed directional graph relations and bounded local/federated references. Prove the contract independently of domain migration and preserve all existing G1 domain owners/contracts.

## Authority chain
- `AGENTS.md`
- `docs/current/PROJECT_STATE.md`
- `docs/current/CURRENT_MILESTONE.md`
- `project_docs/schedule/SPRINT_GENERATION_POLICY.md`
- `project_docs/schedule/SPRINT_MODE.md`
- `project_docs/execution_planning/G2-WP-01-SEMANTIC-CONSTITUTION.md`
- G2 planning authority at `research/g2-capability-pipeline` head `2ef10187d691666b45cba5978671570f0ff90c2a`, especially C0, Planning B UCA reconciliation, D0/D1, E1/E7, WBS-01, WBS DAG, Work Package Design and Worker Handoff.

## Predecessor gate
M19/P19 is canonically closed and fresh `main` is exactly `d8760c7f08757bb164a758ae0c3f0a4a1752464b`. `G2-WBS-01` is Layer L0 with no WBS predecessor. This Sprint may start only after the Planning Sprint integrates to `main` and fresh-main revalidation confirms no superseding authority.

## Committed TASK set
Dependency order:

`TASK-463 -> TASK-464 -> TASK-465 -> TASK-466 -> TASK-467 -> TASK-468`

- `TASK-463` — define additive semantic-substrate contract version, owner-qualified canonical/definition/occurrence/realization identity primitives and fail-closed constructors/validators.
- `TASK-464` — define sparse immutable `RevisionVector`, definition revision references and correction/supersession structural lineage without domain lifecycle ownership.
- `TASK-465` — define portable temporal/currentness qualification coordinates and explicit unknown/insufficient currentness without converting provenance into truth.
- `TASK-466` — define typed semantic nodes/relations and deterministic owner-preserving graph validation, rejecting owner/type/revision mismatch and unknown relation strengthening.
- `TASK-467` — define bounded inter-system/federated and local/Station/Fleet qualification references that preserve independent truth/currentness and cannot amplify remote claims.
- `TASK-468` — expose the coherent contract surface and prove the growing semantic-substrate journey across multiple owners with negative/adversarial regression.

## Allowed product surface
Construction is bounded primarily to:
- `packages/contracts/semantic-substrate/**`
- focused `tests/product/g2-semantic-substrate*.test.ts`
- this Sprint manifest and its TASK specs for bounded status/evidence updates.

No existing domain contract may be destructively changed in Construction A. Any consumer integration belongs to Construction B unless a tiny import/export compatibility edit is strictly necessary and already allowed by the relevant TASK.

## Growing integration proof at exit
1. Create canonical semantic identities for at least two distinct owner capabilities.
2. Create immutable definition/revision and occurrence references while keeping realization identity separate.
3. Bind a sparse revision vector and temporal/currentness qualification without rewriting producing history.
4. Compose typed directional graph relations and validate deterministic normalization.
5. Represent local and federated references with explicit system/locality/currentness qualification.
6. Reject equal-value external/provider identity substitution, owner mismatch, stale/substituted revision, invalid temporal/currentness qualification, unknown/invalid relation type and federation/locality strengthening.
7. Demonstrate backward coexistence: existing bounded G1 identity/version/provenance contracts remain unchanged and are not reinterpreted as universal G2 truth.

## Required negative/adversarial coverage
- same external/provider value presented as canonical identity;
- blank/ambiguous semantic owner or semantic kind;
- mutable/reordered/duplicated revision dimensions producing nondeterministic identity;
- substituted definition revision or producing vector;
- currentness asserted without scope/time basis when required;
- graph relation referencing an owner/type/revision inconsistent endpoint;
- relation kind or transform that strengthens a foreign owner's claim;
- remote/Fleet aggregate treated as local/Station canonical truth;
- federation record missing bilateral system/revision qualification;
- arbitrary JSON metadata attempting to erase semantic kind/owner;
- accidental import from Runtime/Builder internals or creation of a universal evaluator/policy owner.

## Final validation
- `npm run test:product`
- `npm run check:tasks`
- `npm run check:architecture`
- `npm run typecheck`
- `npm run verify`

Heavy Product Tests are required only if implementation introduces process/server/socket/Postgres/openssl behavior; Construction A is expected to remain deterministic/in-memory and therefore core product proof is the intended classification.

## Stop / escalation conditions
Stop before implementation or successor promotion if:
- a new runtime/service/bounded-context topology is required;
- an existing public contract must be destructively replaced;
- UCA would become owner of domain predicates, authorization, provider truth, workflow execution or business decisions;
- a reverse dependency from Runtime to Builder is required;
- architecture gates require an ADR not already represented by the decided G2 target;
- the planning base or G2 authority is superseded before Construction begins.

## Forecast after exit
Construction B `G2-SEMANTIC-CONSUMER-COEXISTENCE-01` remains FORECAST. It may be promoted only after this Sprint is reviewed/integrated, fresh `main` is reconstructed and actual Construction A outputs are revalidated.