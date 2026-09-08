# G2-WP-02 — Elicitation Knowledge Base & System Understanding

Status: PLANNING & MATERIALIZATION / CONSTRUCTION A COMMITTED / NOT EXECUTED
Date: 2026-09-08
Generation: Generation 2 — Capability Architecture & Symbiotic Platform Engineering
Fresh-main planning base: `b86a606834976444e4eb7c4f8605417b59e49620`
Planning authority: `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`
WBS authority: `G2-WBS-02 — Elicitation Knowledge Base and adaptive understanding`

## Package goal
Introduce the minimum additive, versioned and auditable Elicitation Knowledge Base (EKB) contract substrate required by G2-WBS-02 without creating a 29th canonical capability, a monolithic questionnaire, an AI authority, a new domain truth owner or a storage/runtime topology.

The EKB is cross-cutting authoring/knowledge infrastructure over the integrated WP-01 semantic substrate. It owns question-definition/occurrence metadata, typed elicitation information records, routing/coverage/unresolved projections and traceability metadata needed to conduct elicitation. Business predicates discovered through elicitation remain owned by their canonical capability owners.

## Predecessor gate
`G2-WP-01 — Semantic Constitution & Federated Revision Base` is canonically CLOSED on fresh `main` `b86a606834976444e4eb7c4f8605417b59e49620` after PR #560 closure reconciliation. WP-02 typed prerequisites `SEMANTIC_PREREQUISITE`, `REVISION_PREREQUISITE`, and `EVIDENCE_PREREQUISITE` are therefore satisfied.

WP-03 and WP-04 remain DESIGNED / NOT MATERIALIZED. Their ability to elaborate later does not permit this package to pre-materialize their semantics.

## Existing-owner reconciliation
- `packages/contracts/semantic-substrate/**` remains owner of portable G2 semantic identity/revision/currentness/locality structures.
- `packages/contracts/knowledge-boundary/**` remains the historical G1 owner of knowledge promotion/transformation controls and is not redefined as the EKB.
- `packages/contracts/evidence-provenance/**` remains historical evidence/provenance authority.
- M15 `human-decision` and existing decision-boundary contracts remain business promotion/rejection authority.
- Existing process-versioning, Factory/Compiler/Release/Deploy/Runtime/Observe owners remain unchanged.

Construction A may introduce an additive public structural contract family under `packages/contracts/elicitation-knowledge-base/**` that references these public owners directionally. It may not introduce reverse dependencies or reinterpret historical contracts as universal G2 truth.

## Constitutional invariants
- `QuestionDefinition != QuestionOccurrence != Answer != Finding != Decision`.
- `answered != understood != evidence sufficient != contradiction cleared != implementation-ready != production-ready`.
- `Fact`, `Claim`, `Assumption`, `InferredCandidate`, `Decision`, `Requirement`, `Constraint`, `OpenQuestion`, `Conflict`, `Unknown`, `OutOfScope`, and `Deferred` remain distinct.
- `AI inference = InferredCandidate`; AI cannot close mandatory gaps or choose contradiction winners.
- `observed behavior != intended process != approved canonical process`.
- provenance != truth != currentness != authority.
- `Unknown` cannot collapse to empty/null/false/zero when semantically material.
- coverage is multidimensional and gate-relative, never an authoritative scalar completeness score.
- HIGH/CRITICAL unresolved gaps, unowned critical contradictions, absent critical evidence/currentness or unjustified `NOT_APPLICABLE` block false completeness.
- Production Readiness Coverage remains separate from elicitation/feature completeness and from Product Proof.
- Fleet/global projection cannot strengthen Station/local evidence or completeness.

## Committed construction horizon
Only Construction A `G2-EKB-CONTRACT-FOUNDATION-01` is COMMITTED / MATERIALIZED / NOT EXECUTED.

Committed dependency chain:

`TASK-473 -> TASK-474 -> TASK-475 -> TASK-476 -> TASK-477 -> TASK-478`

Construction B remains FORECAST and may address bounded coexistence/consumer integration only after A is reviewed/integrated and fresh-main reconciliation proves a concrete need. Construction C remains OPTIONAL / FORECAST. Package Integration & Review and Documentation & Closure remain FORECAST.

## Construction A proof target
The growing proof must demonstrate:
1. immutable `QuestionDefinitionRevision` and context-bound `QuestionOccurrence` identities without historical rewriting;
2. typed information kinds and explicit governed promotion lineage;
3. evidence/provenance/currentness qualification without converting evidence into truth/authority;
4. contradictions and unresolved questions preserved with explicit owner/evidence/decision routes;
5. deterministic routing/applicability metadata that may fail `INCONCLUSIVE`/unresolved rather than fabricate closure;
6. multidimensional coverage and stage-specific sufficiency where one critical blocked/conflicted dimension prevents false PASS;
7. exact coexistence with semantic-substrate and historical knowledge/evidence owners;
8. negative/adversarial proof for AI promotion, scalar masking, stale evidence, owner cloning, current-question substitution and local/Fleet strengthening.

## Explicit non-goals
Persistence/database design; UI/Master Wizard implementation; AI/provider mechanics; Brownfield importer; canonical domain adoption; authorization/trust implementation; workflow execution; provider qualification; data migration; queue/capacity realization; Production Readiness closure; WP-03+ implementation; TD-P13-01..04; unrelated findings/DEFER/DO_NOT_BUILD.

## Stop / change-control conditions
Stop before implementation or successor promotion if the materialized work would require a new service/bounded-context/runtime topology, persistence ownership, destructive change to an existing public contract, EKB ownership of foreign domain truth, AI or scoring authority, generic business-decision authority, or any L4 topology decision not already authorized.

## Completion definition
WP-02 does not close with Construction A. A must first execute in dependency order, pass exact-head repository gates, undergo review/integration and fresh-main reconciliation. Only then may the next bounded Construction be materialized from actual evidence.