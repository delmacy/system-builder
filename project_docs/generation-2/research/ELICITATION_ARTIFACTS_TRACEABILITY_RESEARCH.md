# Generation 2 — Elicitation Artifacts & Traceability Research

Status: `RESEARCH SUB-ARTIFACT / NOT CANONICALIZED`
Parent: `ELICITATION_SYSTEM_UNDERSTANDING_METHODOLOGY_RESEARCH.md`

## Artifact distinctions

- `UserStory`: actor/user-context + intention + value/outcome. It is a planning/communication artifact, not a complete specification.
- `UseCase`: actor, trigger, preconditions, main flow, alternate flow, failure/recovery flow, external effects and postconditions.
- `Scenario`: a concrete path/condition combination, including happy, alternate, boundary, failure, abuse/misuse, recovery, offline, concurrency and temporal/version-change variants.
- `Requirement`: functional/non-functional/operational/governance/compliance obligation with source/owner/validation route.
- `Constraint`: boundary restricting the allowed solution/design/operation space.
- `AcceptanceCriterion`: bounded observable criterion linked to requirement/scenario.
- `ProductProofObligation`: evidence requirement demonstrating behavior/invariant across relevant positive and negative scenarios.
- `SemanticReference`: typed relation to capabilities, actors, authority, data, workflows, decisions, formulas, UI, providers, evidence, risks or revisions.

No artifact silently subsumes another. A user story does not replace use-case failure semantics; a use case does not replace authority or data contracts; acceptance criteria do not replace runtime evidence.

## Candidate traceability graph

`Source/Elicitation Evidence -> Answer/Finding -> Requirement/Constraint -> User Story/Use Case/Scenario -> Semantic Model -> Capability/Workflow/Data/Decision/UI/Provider/etc. -> Acceptance Criterion -> Test/Product Proof -> Runtime Evidence`

Traceability is many-to-many, revision-qualified and relation-typed. Candidate relation kinds include `elicited-from`, `asserted-by`, `observed-in`, `supports`, `contradicts`, `refines`, `derives`, `constrains`, `implements`, `projects`, `validated-by`, `proved-by`, `runtime-evidence-for`, `supersedes` and `invalidates`.

`lineage != authority != causal proof`. A traceability edge proves a declared relationship, not semantic correctness of every node.

## Currentness and supersession

Each material artifact/reference should be able to identify source revision, effective/observation time where relevant, supersession state and invalidation triggers. A provider/schema/policy/workflow revision can invalidate downstream assumptions or proofs without deleting historical traceability.

Candidate rule: historical evidence remains historical; it must not be rewritten to make a later interpretation appear contemporaneous.

## Contradiction handling

Contradictions may exist between sources or derived artifacts: story vs use case, workflow vs requirement, provider contract vs observed behavior, policy vs operational practice, UI vs authority model. Detection should open a governed unresolved record linked to all conflicting artifacts; it must not auto-select the newest or highest-confidence text as truth.

## Brownfield traceability

Observed legacy artifacts/events/configuration are current-state evidence. Mapping into desired semantic models requires an explicit mapping/decision edge. `observed legacy behavior != desired requirement`.

Provenance backfill is bounded: where original source/currentness is unknowable, record `UNKNOWN`/inferred provenance rather than fabricate certainty.

## AI boundary

AI may derive candidate stories/use cases/scenarios and propose links. AI-generated nodes/edges remain `InferredCandidate` until confirmed by governed evidence/authority where required. AI must preserve dissenting sources and uncertainty instead of merging them into a single authoritative narrative.

## Product-proof carry-forward

Planning E should prove at least:

- source answer changes invalidate or flag dependent artifacts;
- contradictory sources cannot yield a silently `RESOLVED` requirement;
- user story derivation preserves linked use-case failure scenarios;
- semantic references route cross-capability ownership without duplicating truth;
- traceability remains available across revisions;
- runtime evidence can be linked to the exact build/deployment/workflow/capability realization rather than semantic name alone;
- historical provenance gaps are represented honestly.

## Research disposition

Retain as cross-cutting traceability semantics for Planning C classification. No implementation or canonical-capability promotion.