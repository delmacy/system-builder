# Generation 2 — Universal Capability Architecture — Full Pass 5 Revisit

Status: ACTIVE — ELIGIBLE NO-NEW-MATERIAL
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Universal Capability Architecture (UCA)
Pass: 5
Authority: `RESEARCH_PIPELINE_STATE.json`, `ADVERSARIAL_SATURATION_STATE.json`, `UNIVERSAL_CAPABILITY_ARCHITECTURE_EDGE_CASE_REGISTER.md`, `PLANNING_A_UNIVERSAL_CAPABILITY_ARCHITECTURE_BOUNDARIES.md`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, and `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`.

Research only. No product code, Work Package, TASK, Construction, GraphDB implementation, Fleet control plane, global IR implementation, automatic remediation or concrete conflict correction is authorized. Preserve `ConflictPattern != ConflictInstance` and `Signal != ConfirmedConflict`. Default disposition remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## 1. Revisit purpose and method

This Full Pass 5 revisit carried the prioritized **Typed Semantic Graph + ExecutionEnvelope + Autonomous Builds/Fleet Observability** hypothesis into UCA without assuming it is the target architecture. The objective was to determine whether the hypothesis exposes a new universal semantic primitive, a missing owner, or a new conflict class, while explicitly resisting a UCA semantic god-object.

Techniques were rotated from prior passes:

1. **identity-lineage substitution matrix** — exchange `CanonicalCapabilityRef`, `CapabilityUse`, build/release identity, runtime realization, deployment identity, node invocation and telemetry identity and test whether equality at one layer is improperly promoted to another;
2. **generic-envelope weakening mutation** — remove owner/type, presence, revision, applicability, evidence-currentness, authority, effect-stage or compatibility-direction dimensions from an otherwise structurally valid envelope and test whether consumers silently strengthen the result;
3. **semantic topology versus realization topology differential** — hold the semantic node/capability graph constant while changing build, deployment, provider, tenancy and runtime topology, then test whether canonical semantics drift without an explicit owner decision;
4. **cross-build comparability falsification** — aggregate metrics/evidence for two realizations of the same canonical capability while varying build revision, provider, resource profile, instrumentation, sampling and contract semantics; test whether semantic identity alone is treated as proof of metric equivalence;
5. **ExecutionEnvelope boundary pressure** — increase context, payload references, revision vectors, evidence links, children and effects while keeping the workflow valid, looking for hidden collapse into an unbounded payload/journal or silent truncation that strengthens a claim;
6. **presence-state mutation** — permute `ABSENT`, `UNSET`, explicit `null`, default, redacted, deleted and `UNKNOWN` through generic graph/config/envelope projections;
7. **stage-lineage mutation** — permute attempted/accepted/effective/converged/validated and `APPLIED/NOT_APPLIED/PARTIAL/UNKNOWN` across provider, runtime, journal and Fleet projections;
8. **authority composition metamorphics** — compose individually qualified scopes, targets, providers, tenants and AI-generated capability uses in different orders, checking for union/cartesian-product amplification;
9. **offline/residual-cohort cut** — disconnect Fleet/export and retain old builds/providers/workers/clients to test whether global absence, local evidence or residual activity is misrepresented as convergence;
10. **duplicate-screen** against all 119 reusable `G2-CONFLICT-PATTERN-*` patterns and all existing UCA edge scenarios.

No mandatory cluster is incremented by this local revisit. Full Pass 5 mandatory-cluster coverage remains 11/12.

## 2. Evidence refresh

Published semantics continue to support the existing distinctions rather than opening a new reusable conflict class:

- OpenTelemetry service semantic conventions distinguish a logical service from a unique service instance. `service.instance.id` must distinguish concurrent instances of the same service and should not be fabricated by an observer that cannot unambiguously identify the producing instance. This supports `semantic capability identity != runtime/telemetry instance identity` and warns against Fleet-side identity invention: https://opentelemetry.io/docs/specs/semconv/resource/service/.
- OpenTelemetry entity guidance notes that different observers can have difficulty agreeing on instance identity unless the identity is explicitly shared or related. This supports preserving explicit lineage/relationship evidence rather than inferring canonical equivalence from observation: https://opentelemetry.io/docs/specs/semconv/how-to-write-conventions/resource-and-entities/.
- Protocol Buffers field-presence semantics show that explicit presence and implicit presence can be wire-compatible while having materially different application semantics; under implicit presence a default value may be indistinguishable from unset/clear in serialization and merge behavior. Structural/wire compatibility therefore does not prove semantic substitutability: https://protobuf.dev/programming-guides/field_presence/.
- Protocol Buffers 2026 Editions default to explicit presence, further demonstrating that value and presence are separate semantic dimensions even when represented by common message structures: https://protobuf.dev/editions/features/.

Portable conclusion: UCA may define reusable structural vocabulary and lineage relations, but canonical identity, semantic type, owner, presence state, revision/currentness, effect stage, authority and comparability remain explicit qualifications. Neither a typed graph nor a common ExecutionEnvelope may erase those dimensions.

## 3. Prioritized-hypothesis probes

### 3.1 Canonical capability identity versus CapabilityUse / realization identity

The candidate lineage `CanonicalCapabilityRef -> CapabilityUse -> BuildRevision/Release -> RuntimeRealization -> Deployment -> NodeInvocation/Attempt` is useful as a research model only if every arrow remains typed and non-equivalent. Replacing any upstream identity with a downstream provider/runtime/telemetry identity reproduces `G2-EDGE-UCA-001`, provider identity-drift families and semantic-owner adoption hazards. No new material edge survives duplicate-screen.

A semantic node may legitimately have multiple simultaneous uses, builds, deployments and runtime realizations. Therefore same `CanonicalCapabilityRef` is not sufficient evidence that two realization-level observations are interchangeable.

### 3.2 Typed semantic graph versus semantic god-object

Representing reusable capabilities/operations as typed nodes and relationships does not itself create a new owner. The unsafe variant appears only when the graph layer begins deciding domain truth, authority, provider equivalence, policy precedence, compatibility or recovery eligibility. That remains exactly `G2-EDGE-UCA-007` and UCA ownership conflict families.

The research distinction remains:

`Graph semantics != Graph storage provider != runtime state != business truth`.

A PostgreSQL relational representation and a GraphDB projection could both preserve or violate those semantics; storage technology is therefore not a universal semantic conclusion in this phase.

### 3.3 Generic ExecutionEnvelope weakening

A bounded envelope containing references/context plus node-declared inputs/reads/writes/produces/effects is not safe if generic serialization drops semantic type, presence, producing revision, scope, authority or effect disposition. Each tested strengthening after dimension loss maps to existing `QUALIFIED-CLAIM`, `REVISION-VECTOR`, `PRESENCE-SEMANTICS`, convergence/effect-disposition and UCA ownership patterns.

The safe research consequence is negative rather than prescriptive: `ExecutionEnvelope` cannot become an untyped bag whose structural validity implies semantic validity or write authority.

### 3.4 ExecutionState versus ExecutionJournal

Collapsing current execution state with append/history evidence can create false currentness, false convergence or unbounded payload growth. These effects reduce to existing evidence-currentness, historical recomputation, resource/cardinality and false-convergence families. Conversely, moving history to a journal does not make journal evidence authoritative for business truth. No new reusable pattern is required.

### 3.5 Presence semantics through graph/config/envelope projections

Permuting `ABSENT`, `UNSET`, explicit `null`, default, redacted, deleted and `UNKNOWN` reproduced `G2-EDGE-UCA-011` / `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001`. Protocol Buffers provides direct evidence that wire-compatible representations can differ materially in presence semantics. No independent fifth-pass finding is warranted.

### 3.6 Revision-vector joins and version skew

Two individually current artifacts can form a jointly incompatible cut across semantic definition, build, provider, schema, policy, formula, trust or telemetry revisions. This remains `G2-EDGE-UCA-003`, `G2-EDGE-UCA-009`, `REVISION-VECTOR-001` and `COMPATIBILITY-DIRECTION-001`.

The prioritized hypothesis strengthens an existing planning obligation: cross-build aggregation must carry explicit comparability qualification rather than infer comparability from canonical capability identity.

### 3.7 Cross-build Fleet comparability

The strongest new probe used two builds of the same canonical capability with different provider/resource/instrumentation profiles. Naive Fleet rollup can create a misleading semantic average even when both metric streams are individually valid. This does **not** create a new conflict family: activation requires qualification loss across revision/profile/population/currentness and maps to `QUALIFIED-CLAIM-001`, `REVISION-VECTOR-001`, cumulative aggregation/resource/evidence-currentness families and existing Observability semantics.

Diagnostic expectation: Fleet may aggregate only when the aggregation owner has explicit evidence that the compared dimensions are semantically compatible for the requested analysis; otherwise preserve separate cohorts or mark the rollup `INCONCLUSIVE/NOT_COMPARABLE` according to owner semantics.

### 3.8 Runtime truth, local evidence, exported telemetry and Fleet aggregate

These were deliberately permuted as substitute sources. Any promotion of exported telemetry or Fleet aggregate into runtime/business/control truth without owner authority maps to `G2-EDGE-UCA-005`, evidence-currentness and semantic-ownership conflicts. OpenTelemetry's instance identity guidance supports this separation because an external observer may be unable to identify the source unambiguously.

Failure of Fleet/export remains non-authoritative and cannot by itself block an otherwise autonomous authorized runtime. Absence of exported telemetry also cannot prove absence of local runtime activity.

### 3.9 Shared infrastructure without shared truth

Reusing shared clusters/providers while varying tenant/workspace/client identity demonstrated no new UCA primitive. Unsafe outcomes require namespace collapse, authority widening, privacy leakage, provider identity confusion or residual-cohort ambiguity, all already catalogued. UCA must preserve typed ownership/tenancy relations but does not select one universal tenancy topology.

### 3.10 Authority amplification and AI/low-code composition

Composing individually permitted capability uses across target services, providers, tenants or scopes can produce an authority set larger than any intended individual grant. Existing authority-composition and UCA ownership patterns already cover the failure. The graph hypothesis does not make path composability equivalent to authorization composability.

AI/low-code generation remains subject to the same rule: syntactic graph validity and locally valid capability nodes do not prove the composed subgraph is jointly authorized or semantically consistent.

### 3.11 Recovery, rollback and correction qualification

A graph/build/release relation that says a prior artifact exists does not establish rollback eligibility. Local journal evidence does not prove all residual cohorts are drained. Fleet silence does not prove convergence. These remain `G2-EDGE-UCA-006`, residual-cohort, recovery qualification, compatibility-direction and false-safety families.

### 3.12 Graph/resource pressure

Very large typed graphs, revision vectors, lineage links, ExecutionEnvelope references, telemetry dimensions and Fleet cohorts can exhaust storage, query, reconciliation or operator capacity. A resource limit or truncation strategy is implementation/owner dependent; the universal hazard is only silent truncation/approximation that emits a stronger claim. Existing resource/capacity and evidence-coverage patterns remain sufficient.

## 4. Conflict-family coverage

The revisit explicitly challenged all required processual/semantic families: structural graph; state/transition; semantic ownership; rule/formula/condition; temporal/ordering; resource/capacity; authority/responsibility/SoD; policy/compliance; data/consistency; provider/integration; version/migration/coexistence; exception/compensation/recovery; human procedure/instruction; cross-process; objective/optimization; AI/low-code composition.

Potential signals were classified as signals/pattern matches, not `ConflictInstance`s. Every candidate reduced to an existing owner set, detection route and future remediation disposition. No HIGH/CRITICAL candidate without owner/proof/detection route was introduced.

## 5. Saturation disposition

- new local material edge scenarios: **0**;
- new cross-capability material scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- new preventive invariants: **0**;
- UCA eligible no-material streak: **1 -> 2**;
- mandatory cluster streaks: **unchanged**;
- campaign inventory: **284 material edge scenarios + 119 reusable ConflictPatterns = 403 material findings**;
- HIGH/CRITICAL findings without semantic owner/proof obligation/detection route: **0**;
- negative-space adversarial review: **NOT_STARTED**;
- saturation: **NOT_SATURATED**;
- Planning C: **BLOCKED**.

This is an eligible no-new-material revisit and establishes the required two consecutive eligible revisits for UCA unless a later material finding resets the streak. It is not a claim of defect absence.

## 6. Prioritized architecture-hypothesis disposition

The Typed Semantic Graph + ExecutionEnvelope + Autonomous Builds/Fleet Observability hypothesis **survives this UCA revisit as `HIPÓTESE DE ARQUITETURA / EM PESQUISA` only**. No Planning-C decision is made.

Surviving carry-forward questions are:

1. whether canonical semantic representation should be graph-shaped or merely graph-projectable;
2. which node/edge taxonomy is canonical versus owner-specific;
3. how UCA structural primitives relate to `CapabilityDefinition` and typed `CapabilityUse` without owning domain predicates;
4. which ExecutionEnvelope fields are mandatory semantic qualifications and which remain capability-specific;
5. how state/journal/business truth remain separated while preserving reconstructible lineage;
6. how build/release/deployment/runtime identities are linked without identity collapse;
7. what explicit comparability contract permits cross-build semantic metric rollup;
8. how Fleet remains output/projection, privacy/policy governed and non-authoritative;
9. whether PostgreSQL relational graph persistence is sufficient as baseline and GraphDB remains an optional provider/projection boundary;
10. how resource/cardinality bounds preserve diagnostic honesty instead of truncating evidence into false certainty.

No bounded synthesis or Planning-A backfill is required by this revisit.

## 7. Next rotation

Continue only Full Pass 5 with **UI / Generated Experience / Low-code Builder**. Carry Typed Semantic Graph + ExecutionEnvelope + Autonomous Builds/Fleet Observability into Canvas/Graph Explorer projection versus source of truth; explicit client/workspace context barriers; `CapabilityDefinition` versus `CapabilityUse` rendering; stale graph/revision projections; hidden/disabled/read-only versus authorization; `ABSENT/null/default/delete`; offline/residual clients; optimistic interaction under `PARTIAL/UNKNOWN`; accessibility/localization semantic drift; generated mutations versus canonical owner semantics; Fleet/global aggregate versus concrete client payload; cross-build UI/telemetry comparability; graph/fan-out/cardinality pressure; cumulative privacy/trust leakage; and AI/low-code composition that widens authority, hides evidence or creates contradictory work.

Duplicate-screen all 119 ConflictPatterns. Preserve semantic topology != build topology != deployment topology != runtime truth != local evidence != exported telemetry != fleet aggregate != control authority. Fleet remains non-authoritative by default; GraphDB remains optional/provider-level. Do not enter Planning C.
