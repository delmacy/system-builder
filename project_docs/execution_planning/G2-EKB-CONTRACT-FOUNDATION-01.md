# G2-EKB-CONTRACT-FOUNDATION-01 — Construction A

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Work Package: `G2-WP-02 — Elicitation Knowledge Base & System Understanding`
Planning base: `b86a606834976444e4eb7c4f8605417b59e49620`
Planning Sprint: `G2-WP02-PLANNING-MATERIALIZATION-01`
Intended Construction branch: `sprint/G2-EKB-CONTRACT-FOUNDATION-01`
WBS: `G2-WBS-02`
Planning authority: `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`

## Sprint goal
Establish the first executable EKB structural contract family as an additive consumer of the integrated semantic substrate while preserving existing G1 knowledge/evidence/decision owners. The Sprint covers only reusable question identity/revision, typed information state, qualified evidence/currentness references, contradiction/unresolved routing metadata, multidimensional coverage/sufficiency and an integrated deterministic proof.

## Authority chain
- `AGENTS.md`
- `docs/current/PROJECT_STATE.md`
- `docs/current/CURRENT_MILESTONE.md`
- `docs/current/NEXT_WORK.md`
- `project_docs/schedule/SPRINT_GENERATION_POLICY.md`
- `project_docs/schedule/SPRINT_MODE.md`
- `project_docs/execution_planning/G2-WP-02-ELICITATION-KNOWLEDGE-BASE.md`
- G2 C1 Elicitation architecture, D1 coexistence, E1 proof matrix, WBS-02, exact WBS DAG, Work Package Design and Worker Handoff at the pinned planning revision.

## Predecessor gate
WP-01 is canonically CLOSED and its reviewed closure tree is integrated into fresh `main` `b86a606834976444e4eb7c4f8605417b59e49620`. This Construction may start only after this Planning & Materialization Sprint passes exact-head review/CI, integrates to `main`, and fresh-main revalidation confirms no superseding authority or concurrent product mutation.

## Committed TASK set
Dependency order:

`TASK-473 -> TASK-474 -> TASK-475 -> TASK-476 -> TASK-477 -> TASK-478`

- `TASK-473` — define immutable reusable QuestionDefinition revision refs and context-bound QuestionOccurrence identity/lifecycle refs without rewriting historical wording.
- `TASK-474` — define the portable typed InformationRecord kinds and explicit governed promotion/correction lineage, preserving AI candidate status and Unknown/Deferred/OutOfScope distinctions.
- `TASK-475` — bind EKB records to qualified semantic owner, evidence/provenance/currentness and locality references without converting evidence into truth or authority.
- `TASK-476` — define contradiction and unresolved-question structural records plus deterministic owner/routing/applicability outcomes that preserve competing records and explicit inconclusive/unresolved states.
- `TASK-477` — define multidimensional elicitation coverage and stage-specific sufficiency evaluation that fails closed on applicable HIGH/CRITICAL unresolved obligations and cannot be overridden by scalar completion.
- `TASK-478` — expose the coherent public EKB contract surface and prove the growing journey across question revision, information state, evidence/currentness, contradiction/routing and sufficiency with negative/adversarial coexistence proofs.

## Allowed product surface
Construction is bounded primarily to:
- `packages/contracts/elicitation-knowledge-base/**`
- focused `tests/product/g2-elicitation-knowledge-base*.test.ts`
- the six TASK specs and this Sprint manifest for bounded status/evidence updates.

Directional public-contract consumption is allowed from:
- `packages/contracts/semantic-substrate/**`
- `packages/contracts/knowledge-boundary/**`
- `packages/contracts/evidence-provenance/**`
- existing decision/human-decision public contracts where proof-only reference is necessary.

Those predecessor surfaces are context/read-only for Construction A unless a TASK explicitly allows a tiny additive public-export compatibility edit. No destructive predecessor edit is authorized.

## Forbidden surface / authority movement
- `packages/runtime-core/**`
- `apps/**`
- persistence/database/schema migrations
- provider adapters or provider cutover
- AI gateway/provider behavior
- workflow execution/effect semantics
- domain authorization/policy implementation
- deployment/observe topology
- canonical business-predicate ownership
- generic physical actuation semantics

## Growing integration proof at exit
1. Pin a historical occurrence to the exact producing QuestionDefinition revision and concrete context.
2. Preserve all 12 C1 information kinds through deterministic normalization and round-trip representation.
3. Demonstrate that AI output remains `InferredCandidate` and promotion requires explicit transition authority/evidence lineage rather than repetition/confidence.
4. Attach evidence/currentness/locality and owner-qualified semantic refs without strengthening truth or authority.
5. Preserve two competing material records and a separate contradiction/unresolved route; recency/summarization may not silently choose a winner.
6. Evaluate coverage by applicable dimension/revision and stage; a critical blocked/conflicted/unqualified obligation prevents sufficiency PASS.
7. Reject current-question substitution for historical wording, stale evidence promotion, owner cloning, unjustified not-applicable, scalar completion masking, and Fleet/global-to-local strengthening.
8. Demonstrate backward coexistence with knowledge-boundary/evidence-provenance: historical owners remain interpretable and authoritative in their existing proof domains.

## Validation
- `npm run test:product`
- `npm run check:tasks`
- `npm run check:architecture`
- `npm run typecheck`
- `npm run verify`

Heavy Product Tests are required if actual implementation crosses the repository heavy-test classifier. Construction A is expected to remain deterministic/in-memory structural contract work.

## Stop / escalation conditions
Stop if implementation requires persistence/storage ownership, a new runtime/service/bounded context, destructive changes to G1 knowledge/evidence/decision contracts, an EKB semantic god-object, AI/scalar authority over sufficiency, implicit domain adoption, or an L4 topology decision.

## Forecast after exit
Construction B remains FORECAST. It may be promoted only after Construction A is reviewed/integrated and fresh-main evidence identifies a bounded coexistence/consumer need. Package Review/Closure and WP-03+ remain unmaterialized.