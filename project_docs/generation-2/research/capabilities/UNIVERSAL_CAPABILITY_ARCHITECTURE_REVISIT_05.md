# G2 Capability Dossier — Universal Capability Architecture — Revisit 5

Status: MATERIAL_NEW_FINDINGS / NOT SATURATED
Research cycle: 6

## Research question
Can the cycle-5 universal primitives survive adversarial representatives whose identity, concurrency, trust, context and artifact semantics differ materially from declarative controllers? In particular, test whether revision-qualified evidence, faceted authority, ambiguous-outcome disposition, dependency-INCONCLUSIVE propagation, qualified local closure/reconnection and semantic-vs-provider realization remain universal without embedding capability-specific assumptions.

## Representatives and evidence/source ledger
1. **Kubernetes API consistency / Server-Side Apply** — `resourceVersion` is opaque and operation-dependent; exact/not-older-than/most-recent reads have different consistency guarantees. Updates and SSA expose conflicts/field ownership rather than silently merging concurrent intent. Sources: https://kubernetes.io/docs/reference/using-api/api-concepts ; https://kubernetes.io/docs/reference/using-api/server-side-apply/
2. **PostgreSQL 18 transaction isolation** — visibility is snapshot/isolation scoped; serializable execution may abort with `serialization_failure` when concurrent dependency patterns cannot correspond to any serial order. This falsifies any assumption that one generic revision/precondition primitive can itself provide transaction consistency. Source: https://www.postgresql.org/docs/18/sql-set-transaction.html
3. **SPIFFE Federation / SVIDs** — workload identity is scoped by trust domain; federation distributes evolving trust bundles and authenticates foreign-domain identities without collapsing administrative authority. Sources: https://spiffe.io/docs/latest/spiffe-specs/spiffe_federation/ ; https://spiffe.io/docs/latest/deploying/svids/
4. **OpenTelemetry Context / Baggage** — distributed context is explicitly propagated across process boundaries; Baggage may cross arbitrary boundaries and APIs must support clearing it before an untrusted process. Context is therefore transportable data, not intrinsically authority-bearing state. Sources: https://opentelemetry.io/docs/specs/otel/overview/ ; https://opentelemetry.io/docs/specs/otel/baggage/api/
5. **OCI Image Specification / Content Descriptors** — descriptors use digest + media type + size to identify and verify immutable content; image manifests intentionally make content addressability part of artifact identity and allow unknown artifact/media types without forcing one execution model. Sources: https://github.com/opencontainers/image-spec/blob/main/descriptor.md ; https://github.com/opencontainers/image-spec/blob/main/manifest.md

Coverage judgment: Kubernetes consistency/ownership `DEEP`; PostgreSQL transaction isolation `DEEP`; SPIFFE federation/trust-domain identity `DEEP`; OpenTelemetry propagated context `DEEP`; OCI content-addressed artifact identity `DEEP`.

## Primitive stress test
### Identity
Cycle 5 was too broad when it suggested provider/runtime identifiers cannot become canonical semantic identity. OCI provides a counterexample: a digest is intentionally canonical identity for immutable content. SPIFFE provides a second qualification: a workload authentication identity intentionally includes its trust domain, so trust-domain migration may legitimately change authentication identity even when a higher-level business/system identity remains stable.

Refined universal rule: **identity is semantic-owner-defined and typed by identity kind/lifespan/scope**. A realization identifier must not silently replace a different semantic owner's identity, but a capability may legitimately define canonical identity from content, trust scope or another domain-specific invariant.

Candidate primitives therefore become `IdentityRef{kind, owner, scope, lifespan}` plus explicit `IdentityMapping/ContinuityClaim`, rather than one universal notion of stable semantic identity.

### Revision, consistency and concurrency
Kubernetes shows revision tokens can be opaque and operation-specific. PostgreSQL shows a transaction can require snapshot/serializable semantics that cannot be expressed by equality against one revision token. Therefore `RevisionRef` remains useful evidence lineage, but consistency is a separate requirement/evidence dimension.

UCA may carry `ConsistencyRequirementRef`, `ConcurrencyPreconditionRef` and `ConflictEvidenceRef`; Data/Workflow/provider owners define snapshot, serializability, locking, compensation or conflict resolution. No universal transaction engine is justified.

### Cumulative context and composition
OpenTelemetry demonstrates that propagated context can be useful while remaining unsafe as implicit authority. Baggage can cross process boundaries and may need clearing before untrusted processes. Therefore cumulative context must preserve provenance/trust classification and authority must be resolved independently.

Universal composition may transport typed context, but **context propagation is not authority propagation**. A downstream operation must intersect current authority/policy with the operation's required facets; inherited data cannot mint authority.

### Trust, federation and local closure
SPIFFE federation makes trust bundles mutable and trust-domain scoped. A static closure manifest can therefore become operationally executable but no longer trustworthy after a trust epoch advances. Qualified local closure must be bound not just to operation/profile but to trust/evidence horizon and reconnection policy.

Refined closure claim: `ClosureProfile + DependencySet + TrustEpoch/Horizon + EvidenceFreshness + ReconnectionRequalificationRule`.

### Artifacts, realization and portability
OCI separates content identity from retrieval location and runtime realization. A digest can remain stable while registries/providers and runtime environments change. This strengthens provider-neutrality but also shows that identity-vs-realization separation must be typed, not absolute: content digest belongs to artifact semantics; registry URL belongs to provider/location realization.

Unknown media/artifact types can remain storable/copyable without being executable. Therefore `can preserve/transport` is distinct from `can interpret`, `can validate`, `can realize` and `may actuate`.

## Failure semantics
The prior vocabulary remains useful (`FAILED`, `DEGRADED`, `STALE`, `INCONCLUSIVE`, `OUTCOME_UNKNOWN`) but is not a universal state machine. Each evidence claim names which predicate failed or became uncertain. PostgreSQL `serialization_failure`, Kubernetes `409 Conflict`, SPIFFE trust validation failure, OCI digest mismatch and ambiguous external actuation are different domain failures that may map to shared evidence dispositions without sharing retry/recovery semantics.

## Authority and governance
Faceted/non-amplifying authority survives the adversarial test. SPIFFE authentication does not confer application authorization; OpenTelemetry context does not confer authority; Kubernetes technical ability to force conflicts is not proof that a caller is authorized to do so. UCA should preserve `AuthorityFacet` and `AuthorityConstraint` as references/claims while Authorization/Policy and capability owners remain semantic owners.

AGWS remains explicitly distinct. `Enterprise → Station → Role → Person` is **not** generalized into the universal scope hierarchy. UCA only supplies generic scope/delegation/exposure primitives. AGWS owns that hierarchy, inherited non-weakenable invariants, AI-only materialization and promotion/reset/rollback semantics.

## Evidence and proof composition
A new universality boundary emerged: proof composition is not automatically monotonic. Individually valid evidence can be mutually incompatible because it describes different revisions, transaction snapshots, trust epochs, provider realizations, scopes or freshness horizons. Parent proof satisfaction therefore requires compatibility/joins across evidence qualifiers, not just all children being PASS.

`INCONCLUSIVE` propagates when required evidence is missing **or when required evidence cannot be proven mutually compatible**. This is stronger than simple dependency presence.

## Provider boundaries and lock-in
Provider-neutrality survives as stable semantic contracts plus explicit realization/binding evidence. However portability claims need capability-specific dimensions:
- OCI: content can be portable while execution support is absent.
- SPIFFE: identity can federate while trust domains remain administratively independent.
- PostgreSQL: SQL syntax portability does not imply identical concurrency/isolation behavior.
- Kubernetes: an opaque resourceVersion is not a portable cross-provider revision token.

Therefore UCA must not equate syntactic compatibility, storage/transport portability, semantic compatibility, operational realization and authority.

## Product-specific mechanism vs universal primitive
Do not universalize Kubernetes `resourceVersion/managedFields`, PostgreSQL MVCC/SSI, SPIFFE trust domains/SVIDs, OpenTelemetry Baggage or OCI digest/media-type grammar.

Refined synthesis candidates:
- `IdentityRef{kind, owner, scope, lifespan}`
- `IdentityMapping` / `ContinuityClaim`
- `RevisionRef` / `GenerationRef`
- `ConsistencyRequirementRef` / `ConcurrencyPreconditionRef` / `ConflictEvidenceRef`
- `Requirement` / `CapabilityOffer` / `EffectiveResolution`
- `AttemptRef` / `RealizationRef` / `PostconditionRef`
- `EvidenceRecord` + `EvidenceQualification`
- `EvidenceCompatibility/CompositeProofJoin`
- `EvidenceDependencyRef`
- `AuthorityFacet` / `AuthorityConstraint`
- `GovernedTransitionLineage` / `AmbiguousOutcomeDisposition`
- `ClosureProfile` + `TrustEvidenceHorizon` + `ReconnectionRequalificationRule`

These are research/synthesis candidates, not implementation decisions.

## Convergent patterns
1. Identity has an owner/type/scope; cross-kind continuity requires explicit mapping rather than accidental identifier reuse.
2. Revision lineage and consistency guarantees are separate dimensions.
3. Propagated context is data with provenance, never authority by transit.
4. Evidence must be revision/scope/trust/freshness qualified.
5. Composite proof requires qualifier compatibility, not merely child PASS aggregation.
6. Provider support/discovery/transportability does not imply interpretation, validation, realization or actuation authority.
7. Faceted authority remains non-amplifying.
8. Local closure is profile- and trust/evidence-horizon-qualified and must requalify after relevant reconnection change.
9. Provider substitution may preserve one identity kind while legitimately changing another.
10. Universal architecture standardizes relations/claims, not transaction engines, identity providers, runtimes or orchestrators.

## Divergent / negative evidence
- PostgreSQL consistency semantics are stronger and fundamentally different from Kubernetes optimistic object concurrency.
- SPIFFE makes trust-domain membership part of authentication identity; OCI makes content digest part of artifact identity. These contradict a blanket rule that identity must always remain invariant across provider/topology/trust changes.
- OpenTelemetry deliberately permits broad context propagation, which is useful but unsafe as an authorization carrier.
- OCI preservation of unknown artifact types proves transport/storage compatibility can exist without interpretation or execution support.

These divergences narrow UCA and preserve semantic owners.

## Mandatory hypothesis stress test
### Executable Capability Composition & Cumulative Context
KEEP/HARDEN: typed cumulative context with provenance/trust classification. New constraint: propagated context must never imply delegated authority; each actuation resolves authority independently.

### Transaction / Consistency / Concurrency
HARDEN boundary: `RevisionRef` is insufficient. UCA records requested consistency/preconditions and evidence; Data/Workflow/provider semantics own transaction isolation, serialization, conflict resolution and compensation.

### Topology / Build / Runtime Realization
KEEP: semantic contracts may survive topology/provider changes, but identity continuity is per identity kind. Artifact content identity may remain fixed while runtime realization changes; authn identity may change across trust-domain migration.

### Tenant / Fleet / Edge / Ingress / Routing
KEEP boundary: generic scope/exposure/binding can represent many placements, but UCA must not infer tenant/Station identity or authority from host, route, trust domain or provider placement. AGWS's Enterprise→Station→Role→Person remains capability-owned.

## Comparison with SB
No new repository-wide implementation claim is made in this revisit. Prior bounded searches found no evidence that the refined UCA vocabulary already exists as a complete contract. Full current-state reconciliation remains reserved for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`.

## Reconciliation hypotheses
- **GENERALIZE/HARDEN:** typed identity with owner/kind/scope/lifespan and explicit continuity mappings.
- **HARDEN:** separate revision lineage from consistency/concurrency guarantees.
- **GENERALIZE:** evidence compatibility/composite proof join across revision, scope, trust epoch, realization and freshness.
- **HARDEN constitutional boundary:** context propagation never grants authority; authority remains faceted/non-amplifying.
- **GENERALIZE:** closure horizon includes trust/evidence freshness plus reconnection requalification.
- **GENERALIZE carefully:** distinguish preserve/transport, interpret, validate, realize and actuate capabilities.
- **DO_NOT_BUILD:** universal transaction engine, universal identity ontology, universal scope hierarchy, universal orchestration engine.
- **KEEP distinct:** Adaptive Governed Work Surfaces and its Enterprise→Station→Role→Person hierarchy.

## Repository-validation questions
1. Does SB currently conflate semantic/system identity, provider identity, artifact digest, authn principal or runtime instance identity?
2. Can one semantic object carry multiple identity kinds with explicit continuity/mapping evidence?
3. Are revision/precondition tokens treated as if they implied transaction consistency?
4. Can a capability declare required consistency semantics without UCA owning the implementation?
5. Does propagated/cumulative context carry provenance and trust classification independently of authority?
6. Can dependent proof become INCONCLUSIVE when evidence is individually valid but mutually incompatible by revision/snapshot/trust/freshness?
7. Can local closure expire or require requalification when trust/policy/provider revisions advance?
8. Are preserve/transport, interpret, validate, realize and actuate support represented separately?
9. Can provider/trust-domain migration preserve business identity while changing authn or realization identity without alias confusion?
10. Can AGWS revalidation use generic evidence/authority primitives without UCA absorbing Enterprise→Station→Role→Person semantics?
11. Is any provider/runtime ID silently promoted into another semantic owner's canonical identity?
12. Can ambiguous external outcome remain quarantined while unrelated evidence continues to evaluate?

## Symbiotic Proof
Use one semantic capability spanning an OCI-addressed artifact, a provider/runtime realization, a federated workload identity, a transactional state owner and an AGWS exposure. Prove: (1) artifact digest identity remains stable across registry/runtime provider change; (2) business capability identity remains stable while a trust-domain migration changes authentication identity through explicit continuity mapping; (3) revision evidence does not claim serializable consistency without transaction-owner proof; (4) propagated context reaches a downstream operation but does not broaden authority; (5) individually valid evidence from incompatible revision/snapshot/trust horizons cannot compose into PASS; (6) missing or incompatible required proof yields INCONCLUSIVE; (7) ambiguous external actuation remains quarantined/reconcile-before-retry; (8) preserve/transport of an unknown artifact type does not claim interpretation or execution; (9) local closure becomes stale after relevant trust/policy advancement and requalifies on reconnection; (10) Station/Role/Person change revalidates AGWS without UCA absorbing the hierarchy; (11) provider replacement creates new realization evidence without unnecessary semantic identity churn; (12) authorization remains independently evaluated after federation/context propagation.

## Findings — revisit 5 / cycle 6
- **G2-FINDING-UCA-36 — Universal Identity Must Be Typed and Semantic-Owner-Defined, Not Universally Provider-Distinct:** OCI content digests and SPIFFE trust-domain identities prove that some capability-owned realization/content/trust identifiers are legitimately canonical for their own identity kind; cross-kind continuity requires explicit mapping.
- **G2-FINDING-UCA-37 — Revision Lineage Does Not Constitute a Consistency Guarantee:** Kubernetes opaque resource versions and PostgreSQL serializable isolation show that revision/precondition evidence cannot substitute for domain-owned snapshot/serialization semantics.
- **G2-FINDING-UCA-38 — Propagated Cumulative Context Is Non-Authoritative by Default:** context/baggage can cross process and trust boundaries, so context provenance and actuation authority must remain independently resolved.
- **G2-FINDING-UCA-39 — Composite Proof Requires Evidence-Compatibility Joins:** individually valid child evidence cannot satisfy a parent when revisions, snapshots, trust epochs, scopes, realizations or freshness horizons are mutually incompatible; required incompatibility propagates INCONCLUSIVE.
- **G2-FINDING-UCA-40 — Qualified Local Closure Has a Trust/Evidence Horizon:** executable local dependencies are insufficient when trust/policy/evidence epochs can advance externally; reconnection requires explicit requalification.
- **G2-FINDING-UCA-41 — Portability Must Separate Preserve/Transport, Interpret, Validate, Realize and Actuate:** OCI unknown-media preservation and other representatives show these are distinct capability claims.
- **G2-FINDING-UCA-42 — Identity Continuity Across Provider/Topology/Trust Change Is Per Identity Kind:** business/system identity may remain stable while artifact, authn or realization identities legitimately change; continuity must be explicit rather than globally invariant.
- **G2-FINDING-UCA-43 — Universal Scope Primitives Must Not Absorb AGWS's Governance Hierarchy:** generic scope/delegation/exposure is reusable, but Enterprise→Station→Role→Person remains an AGWS-owned semantic hierarchy with non-weakenable inherited constraints.

## Capability Discovery candidates
- `G2-CAPABILITY-CANDIDATE-TYPED-IDENTITY-CONTINUITY-MAPPING` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile Identity, Artifact, Provider and Lifecycle identity kinds before promotion.
- `G2-CAPABILITY-CANDIDATE-EVIDENCE-COMPATIBILITY-COMPOSITE-PROOF-JOIN` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; multi-representative structural need, but candidate remains unpromoted pending proof-matrix reconciliation.
- `G2-CAPABILITY-CANDIDATE-TRUST-EVIDENCE-HORIZON-QUALIFIED-LOCAL-CLOSURE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; merge target for existing qualified-local-closure family.
- `G2-CAPABILITY-CANDIDATE-CAPABILITY-SUPPORT-LAYERING-PRESERVE-INTERPRET-VALIDATE-REALIZE-ACTUATE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile Provider/Standards/Artifact evidence before promotion.

No candidate is promoted in this revisit. Adaptive Governed Work Surfaces remains promoted and distinct.

## Architecture proof backfill — UCA
Status: `PARTIAL` obligations defined for later acceptance translation:
1. content-addressed artifact identity remains canonical for artifact content while registry/runtime identity varies;
2. trust-domain migration changes authn identity while higher semantic identity continuity requires explicit mapping;
3. a current revision token without required transaction-owner proof cannot satisfy serializable-consistency obligation;
4. propagated context cannot broaden effective authority;
5. individually valid but revision/snapshot/trust-incompatible evidence makes composite proof INCONCLUSIVE;
6. missing required compatibility/dependency evidence propagates INCONCLUSIVE without invalidating independent proofs;
7. preserve/transport of unknown artifact type cannot claim interpret/validate/realize/actuate support;
8. local closure with stale trust epoch becomes stale/INCONCLUSIVE and requires reconnection requalification;
9. provider/topology substitution preserves only identity kinds whose continuity is explicitly proved;
10. generic scope/delegation primitives cannot weaken AGWS Enterprise→Station→Role→Person inherited authority.

## Saturation decision
**NOT SATURATED.** Eight material architectural findings refine previously over-broad universal assumptions. `consecutive_no_material_finding = 0`. Cycle 6 must continue to the next oldest non-saturated capability; synthesis remains blocked.