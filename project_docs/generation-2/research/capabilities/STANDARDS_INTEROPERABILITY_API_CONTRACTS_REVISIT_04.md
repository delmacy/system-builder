# Generation 2 — Standards / Interoperability / API Contracts — Revisit 04

Status: REVISIT CYCLE 5 — MATERIAL NEW FINDINGS — NOT SATURATED

## Research question

How should Generation 2 prove that a consumer is actually receiving the intended semantic contract/profile across protocol, schema, transport, provider and lifecycle revisions; preserve directional/transitive compatibility without confusing syntactic acceptance with semantic conformance; govern cross-boundary references and provider substitution; and keep local/offline interpretation and generated AGWS/AI actions non-amplifying?

## Representatives and evidence/source ledger

| Representative | Evidence extracted | Coverage |
|---|---|---|
| OpenAPI Specification 3.2.0 / 3.1.1 | OAS version is distinct from the described API version; patch compatibility expectations exist, while minor versions may include non-backward-compatible changes; deprecated elements can remain usable; undefined/implementation-defined behavior can reduce portability even when a document is structurally valid. | DEEP |
| Protocol Buffers proto3 evolution guidance | Wire-safe and wire-unsafe schema changes differ; stable field numbers are part of wire identity; representation format changes alter what constitutes a safe evolution. | DEEP |
| Confluent Schema Registry | BACKWARD/FORWARD/FULL and TRANSITIVE variants prove compatibility is directional and baseline-set-qualified; non-transitive success against the latest version does not establish compatibility with the historical population. | DEEP |
| Kubernetes Gateway API ReferenceGrant | Cross-namespace references require target-side trust/consent and implementations must revoke access when the grant is removed. Reference validity is therefore authority-qualified, not merely syntactic. | DEEP |
| RFC 9745 Deprecation + RFC 8594 Sunset | Deprecation and future unavailability are distinct lifecycle facts; Sunset is a hint, not proof of effective withdrawal. | DEEP |
| Pact provider verification | Provider conformance is exercised against contract expectations; contract presence or deployed endpoint reachability is weaker evidence than verification against the intended provider revision/context. | DEEP |
| AsyncAPI 3.1.0 | A specification minor revision can add protocol bindings without breaking existing descriptions, illustrating separation of semantic message/channel intent from protocol-specific binding vocabulary and tooling support. | DEEP |

## Source of truth and identity

The canonical source of truth remains the SB-elected `SemanticContractRevision` plus `ContractProfileRevision`. OpenAPI/AsyncAPI documents, protobuf descriptors, provider discovery, registry schema IDs, routes, content types and generated clients are realizations or evidence unless an external standard/profile has been explicitly adopted as semantic authority.

Identity must remain factored into at least:

- semantic contract/profile identity and revision;
- operation/resource/message identity;
- representation language/dialect revision;
- wire/schema revision;
- provider/binding revision;
- consumer revision/profile and consumer population scope;
- compatibility ruleset and baseline set;
- cross-boundary reference/grant revision;
- lifecycle declaration revision (`active/deprecated/sunset/withdrawn`);
- verification/conformance suite revision;
- observed effective-consumer satisfaction evidence and freshness.

This is stronger than revisit 03: compatibility is not only a relation between producer and consumer revisions. It is also qualified by **which consumer population and baseline set are actually in service**.

## Lifecycle and versioning

A useful lifecycle is:

`draft → interpretation/admission → publish → expose → bind → negotiate → verify compatibility → verify provider conformance → observe consumer-effective use → coexist/migrate → deprecate → sunset-intent → withdraw attempt → observe withdrawal postcondition → retain lineage`.

RFC 9745 and RFC 8594 make deprecation and expected unavailability separate. Therefore a declared sunset date must not be treated as evidence that all consumers have migrated, that the old endpoint is actually gone, or that residual traffic has ceased.

OpenAPI versioning further demonstrates that specification-language version and API semantic version are separate identities. Tooling that understands one OAS feature set may still encounter implementation-defined or undefined constructs that reduce effective interoperability.

## Compatibility windows and transitivity

Confluent provides direct evidence that compatibility is not a global boolean. `BACKWARD` against the latest schema is weaker than `BACKWARD_TRANSITIVE` against all retained historical schemas. The same distinction generalizes to API contracts:

`CompatibilityEvidence = (producerRevision, consumerRevisionOrPopulation, profile, direction, rulesetRevision, baselineSetRevision, representation, context) → PASS | FAIL | INCONCLUSIVE`.

A PASS over one pair cannot be generalized to all consumers unless the baseline set or consumer population is explicit. A system that accepts a new contract against N-1 may still strand N-2 consumers.

This implies a new planning primitive: **consumer-population compatibility closure**. It is evidence that all consumers inside a declared migration scope are covered by an admitted compatibility/conformance relation, not merely that the latest pair passes.

## Executable conformance versus claims

OpenAPI/AsyncAPI/protobuf descriptions and Schema Registry compatibility checks establish structural or declared compatibility. Pact demonstrates a stronger evidence class: exercised provider verification.

Generation 2 should preserve an evidence ladder:

1. description/schema is interpretable;
2. representation is structurally valid;
3. compatibility ruleset says the revision relation is allowed;
4. provider declares/programs the realization;
5. executable conformance/verification passes;
6. intended consumer population actually observes the effective contract/profile;
7. domain postconditions remain satisfied.

Skipping from 2–4 directly to 7 is not acceptable. Missing/stale required evidence propagates `INCONCLUSIVE`.

## Expected-base ownership and concurrent contract evolution

Contract/profile publication, compatibility-policy changes, cross-boundary exposure and provider substitution all mutate shared semantic relationships. These mutations require expected-base or equivalent ownership/concurrency preconditions.

A compatibility PASS calculated against baseline set R is stale if the baseline population, profile, ruleset or target binding changes before cutover. This aligns Standards with Provider/Binding expected-base findings without collapsing semantic ownership into provider state.

## Cross-boundary contract/profile exposure

Gateway API `ReferenceGrant` provides strong multi-tenant evidence that a technically resolvable reference is not automatically authorized. Cross-boundary semantic contract/profile consumption should therefore require target-side or higher-authority consent when the source and target live in separately governed Station/tenant boundaries.

Grant removal must invalidate future effective use and trigger requalification of cached/generated AGWS actions. A stale locally cached grant cannot silently extend authority after reconnection.

Universal primitive:

`CrossBoundarySemanticReference = sourceBoundary + targetSemanticObject + admittedProfile + consentRevision + effectiveEvidence`.

## Deprecation, sunset and withdrawal

RFC 9745 + RFC 8594 establish three separable facts:

- deprecated: no longer preferred/recommended;
- sunset-intent: expected to become unavailable at a future time;
- effective withdrawal: actually unavailable/no longer served for the governed scope.

A fourth SB-specific fact is needed: **consumer-drained**. Effective withdrawal is unsafe if required consumers still depend on the old revision, and consumer-drained cannot be inferred from the calendar alone.

Therefore:

`withdrawal readiness = lifecycle policy + consumer-population evidence + replacement readiness + rollback/recovery eligibility`.

## Partial / ambiguous conformance and failure semantics

Required outcomes include:

- `PASS`: all mandatory evaluated obligations pass under the declared profile/scope;
- `FAIL`: one or more mandatory obligations fail;
- `PARTIAL`: only a qualified subset is proven and the profile allows partial exposure;
- `INCONCLUSIVE`: required dependency/evidence is missing, stale or cannot be executed;
- `OUTCOME_UNKNOWN`: an external publication/cutover/withdrawal actuation may have occurred but acknowledgement/effective state is ambiguous.

`OUTCOME_UNKNOWN` must trigger observation/reconciliation before retry when duplicate publication, conflicting route/profile exposure or double-withdrawal can cause harm.

## Provider substitution and coexistence

Provider substitution succeeds only when the semantic contract/profile remains satisfied for the intended consumer population. Required evidence should bind:

`SemanticContractRevision + ConsumerPopulationRevision + ProviderBindingRevision + CompatibilityBaselineSet + ConformanceSuiteRevision + EffectiveConsumerObservation + Freshness`.

Dual-run/coexistence should retain which consumers are served by old/new realizations and whether residual traffic remains. Provider-current status is insufficient.

## Governance and authority

Govern separately:

- semantic contract/profile authorship and publication;
- compatibility ruleset/baseline authority;
- external standard/profile adoption;
- cross-boundary reference consent;
- provider realization/binding;
- downgrade/fallback exception;
- deprecation/sunset/withdrawal;
- conformance-suite acceptance;
- Station exposure;
- AI/AGWS generation and invocation;
- reconciliation/normalization of external contract evidence.

Authority is faceted and non-amplifying. Read/interpret/verify authority does not imply publish, expose, bind, withdraw or provider-admin authority.

## Observability

Observability should correlate runtime activity with:

- semantic contract/profile revision;
- provider/binding revision;
- representation/wire revision;
- consumer population/profile;
- compatibility assessment/baseline set;
- cross-boundary grant/Station exposure revision;
- lifecycle state;
- conformance result/freshness;
- residual old-revision traffic.

This supports evidence-driven deprecation and provider cutover instead of calendar-only decisions.

## Portability / lock-in / qualified local closure

A qualified local standards closure should carry the material needed to reproduce interpretation and admitted local operation:

- semantic contracts/profiles;
- referenced schemas/descriptors/specification dialects;
- compatibility ruleset and baseline-set snapshot;
- conversion/adaptation mappings;
- conformance tests/fixtures and expected semantic outcomes;
- cross-boundary consent/exposure snapshot with validity scope;
- provider/binding metadata required for the admitted local profile;
- lifecycle state and retained migration/rollback prerequisites;
- trust/signature/provenance material needed to qualify all of the above.

Offline closure cannot create new authority. Reconnection must requalify freshness, consent, provider state and lifecycle assumptions before privileged or cross-boundary operation resumes.

## Product-specific mechanisms versus universal primitives

| Mechanism | Universal primitive |
|---|---|
| OpenAPI feature-set/version + deprecated elements | representation-language revision + lifecycle declaration distinct from API semantic revision |
| Protobuf wire-safe evolution | representation compatibility class qualified by format |
| Confluent BACKWARD/FORWARD/FULL + TRANSITIVE | directional compatibility + explicit historical baseline set |
| Gateway API ReferenceGrant | target-side cross-boundary reference consent + revocation |
| RFC Deprecation/Sunset | lifecycle declaration separated from effective withdrawal |
| Pact verification | executable provider conformance evidence |
| AsyncAPI protocol bindings | semantic async contract projected into provider/protocol binding vocabulary |

## Convergent patterns

1. Structural validity, compatibility, provider readiness, consumer uptake and semantic satisfaction are independent evidence planes.
2. Compatibility must identify direction and the historical/consumer baseline set.
3. Cross-boundary references require explicit consent, not mere resolvability.
4. Deprecation, sunset intent, withdrawal and consumer drainage are distinct lifecycle facts.
5. Provider substitution/cutover is consumer-effective, not provider-current.
6. Offline closure must preserve interpretation, compatibility and authority qualification while remaining non-amplifying.
7. AI/AGWS may consume admitted semantic operations but cannot invent or weaken contracts to fit a surface.

## Divergent patterns

- OpenAPI tolerates implementation-defined/undefined behavior that can preserve document validity while reducing portable interoperability.
- Protobuf's safety depends on wire representation; binary and JSON evolution constraints differ.
- Confluent can prove compatibility against only the latest baseline or transitively against history, making baseline scope explicit.
- Gateway API adds authority semantics to references rather than treating references as pure graph edges.
- RFC lifecycle headers communicate provider intent and hints; they are not effective-state evidence.
- Pact tests executable interactions and therefore sits above description/schema compatibility in the evidence ladder.

## Subcapabilities

- semantic contract/profile registry;
- representation and dialect registry;
- compatibility-class/ruleset registry;
- consumer-population and baseline-set compatibility evidence;
- executable provider conformance evidence;
- cross-boundary reference consent;
- lifecycle/deprecation/sunset/withdrawal evidence;
- consumer-drainage/residual-use evidence;
- provider substitution/coexistence evidence;
- qualified local standards/conformance closure.

## SB comparison — bounded evidence only

The prior bounded repository evidence remains: `SystemDefinition.integrations[]` has a logical integration identity and `bindingRef`, while HTTP method/path is a concrete invocation realization. This supports **KEEP** of logical integration identity and binding separation, and **GENERALIZE/HARDEN** toward typed semantic contract/profile revision plus evidence-qualified compatibility/conformance.

No claim is made here that current `main` already has consumer-population compatibility, transitive baseline sets, cross-boundary consent or executable conformance semantics; those remain repository-validation questions for Planning B.

## Reconciliation hypotheses

- **KEEP** logical integration identity and binding separation.
- **HARDEN** semantic contract/profile references with revision and expected-base ownership.
- **GENERALIZE** compatibility from pairwise/global booleans to direction + ruleset + baseline/consumer population evidence.
- **INTEGRATE** Provider/Binding consumer-effective satisfaction with Standards-owned semantic conformance.
- **INTEGRATE** Lifecycle deprecation/sunset/withdrawal with consumer-drainage evidence.
- **HARDEN** cross-Station/tenant semantic references with explicit target-side/higher-authority consent.
- **HARDEN** `INCONCLUSIVE` and `OUTCOME_UNKNOWN` propagation for incomplete or ambiguous contract transitions.
- **GENERALIZE** qualified local closure and reconnection requalification.
- **PROVIDERIZE** OpenAPI/AsyncAPI/protobuf/Schema Registry/Pact-specific mechanisms behind semantic contracts/profiles/evidence.
- **DEFER** creation of a proprietary universal wire/API-description standard.
- **DO_NOT_BUILD** global `compatible`, `conformant`, `deprecated`, `sunset-complete` or `provider-ready == consumer-satisfied` booleans.

## Repository-validation questions

1. Is compatibility currently tied to a specific producer/consumer pair, and can it express a historical baseline set or consumer population?
2. Can contract/profile mutations use expected-base or ownership preconditions?
3. Is provider verification/conformance represented separately from schema validation and endpoint reachability?
4. Can runtime evidence identify which contract/provider revision each consumer population actually uses?
5. Can cross-Station/tenant references require target-side consent and revoke it deterministically?
6. Are deprecation, sunset intent, effective withdrawal and residual-use/drainage distinct?
7. Does provider substitution preserve semantic operation identity while re-proving consumer-effective satisfaction?
8. Can missing conformance dependencies propagate `INCONCLUSIVE` rather than false PASS?
9. Can ambiguous external publication/cutover/withdrawal become `OUTCOME_UNKNOWN` and reconcile before retry?
10. Can offline runtimes interpret and verify admitted semantic operations without mutable online registries and requalify after reconnection?

## Architecture proof backfill — cycle 5 obligations

1. **Pairwise-vs-transitive proof:** make N compatible with N-1 but incompatible with N-2; a non-transitive check may PASS, while a population including N-2 must FAIL/INCONCLUSIVE.
2. **Consumer-effective proof:** provider advertises and passes structural checks for profile B while a required consumer still uses A; cutover must remain incomplete.
3. **Executable-conformance proof:** OpenAPI/schema validation passes but provider behavior violates a required semantic postcondition; conformance must FAIL independently.
4. **Cross-boundary consent proof:** create a technically resolvable cross-Station reference without target consent; effective use must be denied, then admitted after consent and revoked after consent removal.
5. **Expected-base proof:** compute compatibility/conformance on baseline R, mutate the baseline/consumer population, then attempt cutover from stale evidence; require revalidation/conflict.
6. **Lifecycle proof:** mark an operation deprecated and announce sunset while it remains served; evidence must not claim withdrawal or drained consumers.
7. **Ambiguous-actuation proof:** lose acknowledgement during external publication/withdrawal; enter `OUTCOME_UNKNOWN`, observe/reconcile, and refuse blind duplicate actuation.
8. **Provider-substitution proof:** dual-run two providers and prove semantic satisfaction for declared consumers before old-provider withdrawal; residual traffic blocks closure.
9. **Offline-closure proof:** interpret/verify locally with retained closure, then remove one required ruleset/schema/trust/consent dependency; result must degrade/deny/`INCONCLUSIVE`, not fetch silently or broaden authority.
10. **AI/AGWS non-amplification proof:** ask AI to generate an action requiring an unexposed operation or weaker profile; generation must reject/escalate rather than invent endpoint semantics, downgrade or bypass Station consent.

## Adaptive Governed Work Surfaces boundary

Adaptive Governed Work Surfaces remains explicitly promoted and distinct from generic UI. A Station/Role/Person surface can bind only semantic operations/profiles admitted by its effective exposure and cross-boundary consent. AI may materialize calls/actions only from those admitted contracts and provider bindings.

AI/AGWS cannot:

- invent endpoint/query/message semantics;
- reinterpret undefined/implementation-defined standard behavior as canonical domain meaning;
- choose non-transitive or weaker compatibility evidence when the governed consumer population requires stronger evidence;
- downgrade mandatory profile semantics silently;
- retain cross-boundary access after grant/Station exposure revocation;
- treat deprecation/sunset declarations as provider cutover authority;
- publish/withdraw contracts or administer providers without explicit authority.

## Symbiotic Proof

Use one semantic operation consumed by an AGWS component across two Stations, two provider realizations and at least two representation mechanisms. Introduce N/N-1/N-2 revisions where pairwise latest compatibility passes but transitive population compatibility fails; show a provider whose description validates but executable semantic verification fails; require target-side consent for cross-Station reference and prove revocation; deprecate and announce sunset without claiming withdrawal; dual-run providers until consumer-effective evidence proves drainage; inject ambiguous publication acknowledgement and reconcile before retry; then repeat admitted interpretation/conformance from a qualified local closure while Builder/provider registries are unavailable. The Person/Role/AI path must never obtain publish, provider-admin, downgrade or cross-boundary authority through the surface.

## Stable findings

### G2-FINDING-SIAC-30 — Compatibility Must Bind the Historical Baseline Set or Consumer Population, Not Only a Revision Pair
Confluent transitive modes show that N↔N-1 success does not prove N↔historical-population success. Generation 2 must preserve baseline/population scope in compatibility evidence.

### G2-FINDING-SIAC-31 — Structural Contract Validity and Executable Semantic Conformance Are Separate Evidence Classes
OpenAPI/protobuf/schema validation can pass while provider behavior violates the intended semantic operation. Exercised verification must remain independently qualified.

### G2-FINDING-SIAC-32 — Cross-Boundary Contract References Require Explicit Consent and Revocation Semantics
Gateway API ReferenceGrant demonstrates that resolvability does not imply authority. Cross-Station/tenant semantic references require target-side or higher-authority consent and deterministic requalification after revocation.

### G2-FINDING-SIAC-33 — Deprecation, Sunset Intent, Effective Withdrawal and Consumer Drainage Are Distinct Lifecycle Facts
RFC 9745 and RFC 8594 separate deprecation from expected unavailability; operational closure additionally requires actual withdrawal and residual-consumer evidence.

### G2-FINDING-SIAC-34 — Compatibility and Conformance Evidence Become Stale When Their Baseline, Population, Profile or Binding Changes
A previously valid assessment cannot authorize cutover after a material consumer/baseline/provider mutation without requalification; expected-base ownership is required.

### G2-FINDING-SIAC-35 — Ambiguous Contract Publication, Cutover or Withdrawal Requires Reconciliation Before Retry
External actuation can succeed while acknowledgement is lost. When duplicate or conflicting effects are possible, `OUTCOME_UNKNOWN` must be observed/reconciled before retry.

### G2-FINDING-SIAC-36 — Provider Substitution Completeness Is Consumer-Effective and Residual-Use Qualified
New-provider readiness alone does not close migration. All governed consumer populations must satisfy the intended semantic profile and residual old-provider use must be dispositioned.

### G2-FINDING-SIAC-37 — AI/AGWS Contract Consumption Is Non-Amplifying Across Semantics, Compatibility and Cross-Boundary Authority
Generated calls/actions may use only admitted semantic operations/profiles and effective provider bindings. Generation cannot invent semantics, weaken compatibility class, retain revoked consent or confer publication/provider authority.

## Capability discovery candidates

### G2-CAPABILITY-CANDIDATE-SIAC-CONSUMER-POPULATION-TRANSITIVE-COMPATIBILITY-CLOSURE — CROSS_CUTTING / CONSOLIDATION_CANDIDATE
Evidence: Confluent transitive compatibility plus provider cutover/consumer-effective findings. Merge target: unified evidence qualification + Lifecycle migration readiness; Standards retains compatibility semantics.

### G2-CAPABILITY-CANDIDATE-SIAC-CROSS-BOUNDARY-SEMANTIC-REFERENCE-CONSENT — CROSS_CUTTING / CONSOLIDATION_CANDIDATE
Evidence: Gateway API ReferenceGrant plus Station/tenant hierarchy. Merge target: Authorization/AGWS delegated exposure, preserving Standards reference semantics.

### G2-CAPABILITY-CANDIDATE-SIAC-DEPRECATION-SUNSET-WITHDRAWAL-DRAINAGE-EVIDENCE — CROSS_CUTTING / CONSOLIDATION_CANDIDATE
Evidence: RFC 9745/RFC 8594 plus consumer-effective migration closure. Merge target: Lifecycle governed transition/evidence.

### G2-CAPABILITY-CANDIDATE-SIAC-EXECUTABLE-SEMANTIC-CONFORMANCE-LADDER — CROSS_CUTTING / CONSOLIDATION_CANDIDATE
Evidence: OpenAPI/protobuf structural evidence plus Pact executable verification. Merge target: unified evidence qualification; Standards retains conformance interpretation.

No candidate is promoted in this revisit.

## Saturation assessment

Coverage is DEEP across seven representative groups, but eight material architectural findings are new. `consecutive_no_material_finding` resets/remains `0`; capability is **NOT SATURATED**.

## Value / risk / priority / next question

Value: HIGH — this closes gaps between schema compatibility, provider readiness, actual consumer satisfaction and cross-boundary authority.

Risk if omitted: HIGH — pairwise tests can strand historical consumers; valid descriptions can mask broken behavior; deprecated APIs can be withdrawn while still required; cross-tenant references can bypass delegated authority; generated actions can silently weaken contract semantics.

Priority: HIGH.

Next question: Lifecycle / Versioning / Evolution / Migration revisit 4 should reconcile consumer-population compatibility closure, deprecation→sunset→withdrawal→drainage, stale readiness evidence and provider substitution into the shared governed transition without duplicating Standards ownership.