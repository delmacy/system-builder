# G2 Capability Dossier — Universal Capability Architecture — Revisit 6

Status: MATERIAL_NEW_FINDINGS / NOT SATURATED
Research cycle: 7

## Research question
Can the accumulated Generation-2 cross-cutting vocabulary remain genuinely universal after Architecture Reconciliation introduced revision-qualified `evidence → finding → product truth → gap → disposition → proof` lineage, semantic-vs-technical ownership separation and executable conformance? This revisit tests by exception whether identity, source-of-truth separation, applicability/revision vectors, evidence compatibility, attempted→accepted→effective→validated lineage, contradiction/staleness, local/offline closure, provider portability and proof composition can be universal without absorbing Data, Identity, Authorization, Lifecycle, Provider, Architecture Reconciliation or Adaptive Governed Work Surfaces semantics.

## Representatives and evidence/source ledger
1. **AWS Prescriptive Guidance — Architectural Decision Records** — accepted ADRs are immutable; changed decisions are represented by new ADRs that supersede old ones, while historical records remain. AWS also states that ADR process does not itself make legacy code compliant. Source of truth: AWS Prescriptive Guidance ADR process and best practices.
2. **Kubernetes API consistency/watch semantics** — `resourceVersion` is opaque and operation-dependent; exact/not-older-than/most-recent semantics differ. Historical watch data has a bounded retention window and clients receiving `410 Gone` must rebuild state from a fresh list/get before resuming. Source of truth: Kubernetes API Concepts.
3. **CUE constraint/unification model** — independently owned constraints may be unified; incomplete values remain valid until enough information exists for concreteness. Unification can establish compatibility of constraints without assigning organizational/semantic authority to their authors. Source of truth: CUE language specification and validation/incomplete-value concepts.
4. **OpenTelemetry versioning, semantic conventions and telemetry schemas** — API, SDK, semantic conventions and contrib components have independent versions/stability; semantic conventions can be mixed-stability, and telemetry schemas/dual-emission support migration between semantic representations. Source of truth: OpenTelemetry specifications on versioning/stability, telemetry stability and schemas.
5. **OCI Image Specification Content Descriptors** — descriptor digest identifies content bytes and allows verification independent of retrieval location; media type, size and digest are distinct descriptor properties, and content identity does not by itself establish semantic interpretation, runtime suitability, policy admission or authority. Source of truth: OCI Image Specification descriptor and image config specifications.

Representative coverage: AWS ADR `DEEP`; Kubernetes API consistency/watch `DEEP`; CUE constraints/unification/incomplete values `DEEP`; OpenTelemetry stability/schema evolution `DEEP`; OCI content descriptors `DEEP`.

## Evidence synthesis
### Source of truth is typed and claim-scoped
The representatives falsify a global `single source of truth` abstraction. AWS ADRs are authoritative for accepted decisions inside their applicability window, not for implementation compliance. Kubernetes live API state is authoritative for a bounded resource observation under explicit consistency semantics, not for business meaning. CUE evaluates constraint compatibility, not organizational ownership. OpenTelemetry semantic conventions define telemetry meaning while implementation versions and emitted telemetry have separate version histories. OCI digests identify bytes while registries/runtime/policy determine realization and admission.

Universal architecture should therefore model **typed claims with explicit owner, scope and applicability**, plus relations between claims, rather than nominate one universal truth store.

### Applicability and evidence availability are separate axes
Kubernetes watch history provides a sharp counterexample to treating staleness only as source mutation. A claim about an older revision can remain historically true while the evidence needed to replay/derive it has fallen outside the retained watch horizon. A `410 Gone` forces observation re-establishment; it does not prove the old event never happened.

UCA therefore needs a distinction between `ClaimApplicability` and `EvidenceAvailability/RetentionHorizon`. Architecture Reconciliation and capability owners decide whether fresh observation can replace historical proof for a specific obligation.

### Constraint compatibility is not semantic authority
CUE demonstrates that constraints owned by separate teams can compose algebraically and become more specific. This is a powerful universal analogy for proof/requirement composition, but it also exposes a boundary: successful unification does not prove that a contributor had semantic authority to impose the constraint. UCA may carry `ConstraintRef`, provenance and compatibility/conflict evidence; Authorization/Governance/semantic owners decide who may make a constraint canonical.

### Conformance is relational, not intrinsic
OpenTelemetry shows that component/API/specification/semantic-convention versions can advance independently, and stable plus development surfaces can coexist in one release. OCI shows byte verification is only one predicate. AWS shows documentation can be accepted while implementation remains non-compliant. Therefore `CONFORMANT` is not an intrinsic boolean on an artifact.

A conformance claim must identify at least: subject/implementation, normative contract/profile, tested revision(s), scope, evaluator/conformance implementation, evidence, and validity/applicability horizon. This aligns directly with Architecture Reconciliation's executable-conformance finding without moving execution ownership into UCA.

### Stability is a vector
OpenTelemetry explicitly permits different stability levels among components/packages and independent version numbers for API, SDK, semantic conventions and contrib artifacts. The universal primitive cannot be `release.status=stable`. Stability/deprecation/support must be attached to typed surfaces/components and their consumer obligations.

### Semantic continuity can require coexistence
OpenTelemetry schemas and dual-emission migration show that semantic evolution may preserve old and new representations concurrently. This supports a universal `Continuity/TranslationClaim` but does not justify a universal migration engine. Standards/Lifecycle owners define what translation or dual representation means and when the old population is drained.

### Cryptographic/content identity is narrower than semantic validity
OCI digest verification establishes that retrieved bytes match a content identifier. It does not prove that the content is semantically valid for an SB capability, admitted by policy, compatible with a runtime, safe, current, authorized or acceptable under a particular Station. UCA must prevent cryptographic integrity evidence from being promoted into broader semantic claims.

## Identity
Retain typed `IdentityRef{kind, owner, scope, lifespan}` and explicit continuity mappings. Add a universal distinction among `ClaimIdentity`, `SubjectIdentity`, `EvidenceIdentity` and `DecisionIdentity` only as typed record roles, not as a universal ontology. OCI content digest remains canonical for content bytes; an ADR identifier remains canonical for a historical decision; Kubernetes resource identity/revision and AGWS Station/Role/Person identity remain capability-owned.

## Lifecycle and versioning
Universal lifecycle should express relations, not one state machine:
- `created/observed → applicable → superseded/expired/invalidated` for claims;
- `attempted → accepted → effective → validated` for governed transitions when the capability actually has those stages;
- `available → compacted/unavailable` for evidence retention;
- `development/stable/deprecated/removed` only when the owning contract defines those semantics.

Do not universalize these into mandatory states for every capability.

## Failure semantics
Shared evidence dispositions remain useful: `FAILED`, `DEGRADED`, `STALE`, `INCONCLUSIVE`, `OUTCOME_UNKNOWN`, `CONTRADICTED`. New exception: `EVIDENCE_UNAVAILABLE` is distinct from `CLAIM_FALSE`; proof can become non-reconstructible because its retention horizon ended even when no contradictory evidence exists. Each capability owns retry/recovery semantics.

## Extensibility and provider boundaries
Providers may produce realization, observation, translation, validation or cryptographic evidence. Provider output never silently changes semantic ownership. Replacement requires new evidence compatible with the consumer's required profile; preserving content or syntax alone is insufficient. UCA owns the typed relation; Provider/Binding, Standards, Lifecycle and the active capability own negotiation/migration semantics.

## Governance and semantic-vs-technical ownership
Architecture Reconciliation's cycle-6 finding survives universality testing: technical mutation/field ownership is not semantic authority. CUE adds a complementary case: mathematical constraint composition also does not establish authority. UCA should carry `OwnershipClaimRef` and `AuthorityRequirementRef` only as references/evidence-bearing relations; Authorization/Governance resolve effective authority.

Historical accepted decisions should be append/supersede, not rewrite. Applicability can change while the prior decision and evidence remain historically addressable.

## Observability and evidence compatibility
Composite proof must join qualifiers, not count child PASS results. Required qualifiers can include subject identity, semantic/profile revision, source revision, trust/policy epoch, provider/binding, scope/Station, consistency profile, evaluator revision, freshness and evidence-retention horizon. A required child with incompatible qualifiers yields `INCONCLUSIVE` or `CONTRADICTED`, not PASS.

## Portability and lock-in
Portability is claim-specific. OCI can preserve content identity across registries while runtime compatibility changes. OpenTelemetry can preserve semantic continuity through schemas/dual emission while consumers migrate. Kubernetes revision tokens are not portable provider-neutral revision semantics. UCA therefore distinguishes at least `preserve/transport`, `translate`, `interpret`, `validate`, `realize` and `actuate` claims without owning their engines.

## Product-specific mechanism vs universal primitive
Do not universalize AWS ADR status values, Kubernetes `resourceVersion`/watch cache, CUE lattice/unification syntax, OpenTelemetry Schema URLs/dual-emission configuration or OCI descriptor grammar.

Synthesis candidates strengthened by this revisit:
- `TypedClaim{kind, owner, subject, scope, applicability}`
- `ClaimRelation{supports, contradicts, supersedes, translates, realizes, validates}`
- `EvidenceRecord` + `EvidenceQualification` + `EvidenceRetentionHorizon`
- `EvidenceCompatibility/CompositeProofJoin`
- `ConstraintRef` + `ConstraintConflictEvidence`
- `ConformanceClaim{subject, contract/profile, revisions, evaluator, scope, evidence}`
- `StabilityFacet/SupportFacet` attached to typed surfaces rather than whole releases
- `Continuity/TranslationClaim`
- `AuthorityRequirementRef` / `OwnershipClaimRef`
- `GovernedTransitionLineage` when a capability defines attempted→accepted→effective→validated stages

These remain research/synthesis candidates, not implementation decisions.

## Convergent patterns
1. Truth is represented by typed, owned claims with bounded applicability rather than one global truth store.
2. Historical truth, current applicability and evidence availability are different axes.
3. Compatibility/composition does not establish authority.
4. Conformance is a relation among subject, normative profile, revisions, evaluator and evidence.
5. Stability/support can vary per surface inside one product/release.
6. Semantic evolution can require coexistence/translation across consumer populations.
7. Content/cryptographic integrity is narrower than semantic validity/admission.
8. Composite proof requires qualifier-compatible evidence.
9. Provider portability is dimension-specific.
10. UCA standardizes record/relationship semantics and proof shape, not domain engines.

## Divergent and negative evidence
- CUE has deterministic algebraic unification, while architecture/provider evidence can remain contradictory or epistemically uncertain; UCA must not pretend all conflicts are mathematically reducible.
- Kubernetes history compaction proves loss of replay evidence can occur without falsifying historical state.
- OpenTelemetry intentionally supports mixed stability and staged semantic migration, contradicting release-wide scalar stability assumptions.
- OCI digest verification is strong byte-level identity evidence but deliberately says nothing about business semantics or authorization.
- AWS immutable ADR history supports append/supersession, while implementation truth remains independently observable.

## Subcapabilities
Typed claim model; applicability/supersession; evidence qualification and retention horizon; evidence compatibility/composite proof joins; contradiction/staleness; semantic-vs-technical ownership references; constraint provenance/conflict; relational conformance; mixed stability/support vector; continuity/translation claims; governed transition lineage; local/offline closure/reconnection requalification; provider-neutral support layering.

## Comparison with SB — bounded fresh-main evidence only
A bounded default-branch code search for the accumulated candidate terms `EvidenceRecord`, `AuthorityFacet`, `CapabilityOffer`, `EffectiveResolution` and `ReconciliationRun` returned no matches. This is only evidence that those exact candidate names are not present in the searched default-branch index; it is **not** evidence of repository-wide absence of equivalent concepts. Authoritative implementation archaeology remains reserved for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`.

## Reconciliation hypotheses
- **GENERALIZE:** typed claim graph with owner/scope/applicability and explicit support/contradiction/supersession/translation/realization/conformance relations.
- **HARDEN:** separate claim applicability from evidence retention/availability.
- **GENERALIZE:** relational, revision-qualified conformance claim; execution engine remains outside UCA.
- **HARDEN:** stability/support as typed facets, never a release-wide scalar assumption.
- **GENERALIZE:** continuity/translation claim for coexistence and migration evidence.
- **HARDEN:** integrity/content identity evidence cannot satisfy semantic/admission/authority proof by implication.
- **KEEP:** faceted/non-amplifying authority, evidence compatibility joins and qualified local closure.
- **INTEGRATE:** Architecture Reconciliation lineage as a consumer/producer of universal typed claims, not as UCA-owned workflow.
- **DO_NOT_BUILD:** global truth store, universal constraint solver, universal migration engine, universal conformance runner, universal stability state machine.
- **KEEP DISTINCT:** Adaptive Governed Work Surfaces and its `Enterprise → Station → Role → Person` hierarchy.

## Repository-validation questions
1. Does SB have any generic record whose fields currently conflate intent, observation, evidence, decision and proof?
2. Can historical evidence become unavailable/compacted without the product interpreting that as claim falsification?
3. Are proof/conformance results tied to both the tested subject revision and the normative profile/evaluator revision?
4. Is stability/support modeled per contract/surface or only via package/release version?
5. Can multiple semantic representations coexist during migration while consumer populations drain?
6. Does integrity verification ever implicitly satisfy semantic validation, admission or authorization?
7. Can constraints from multiple owners be composed while preserving provenance and independent authority checks?
8. Can contradictory evidence survive as first-class state instead of last-writer-wins replacement?
9. Are historical decisions superseded/applicability-qualified rather than mutated in place?
10. Can local/offline Station evidence expire by trust/evidence horizon and requalify at reconnect?
11. Can AGWS consume universal claim/evidence primitives without UCA absorbing Enterprise→Station→Role→Person semantics?
12. Can provider replacement preserve some claim identities while invalidating only affected realization/conformance evidence?

## Adaptive Governed Work Surfaces boundary
Adaptive Governed Work Surfaces remains an explicit active capability, distinct from `UI / Generated Experience / Low-code Builder`. UCA may provide generic typed claims, scope/delegation references, evidence compatibility, lineage and conformance records. AGWS exclusively owns the effective layered surface semantics `Enterprise → Station → Role → Person`, mandatory inherited components, constrained grid/slot/template composition, AI-only materialization, Station capability exposure/delegated administration/hierarchical SB behavior, personal/team/role/system promotion and the nine mandatory proofs.

No universal primitive may infer that UI visibility, AI context, a successful component bind, a constraint match, a provider capability offer or a local Station realization grants authority. AGWS personal actions/automation remain bounded by effective Station/Role authority and canonical domain/process changes require escalation.

## Symbiotic Proof
Use one semantic capability exposed through AGWS and backed by a provider-neutral contract, content-addressed artifact, external provider realization and executable conformance profile. Prove:
1. one accepted historical architecture decision is superseded without rewriting its evidence;
2. fresh product truth can close or reshape a gap without deleting the external finding;
3. an old Kubernetes-style observation becomes unreplayable after retention expiry and yields `EVIDENCE_UNAVAILABLE/INCONCLUSIVE`, not `FALSE`;
4. two independently owned CUE-like constraints compose only after authority to make each canonical is independently proven;
5. a constraint conflict retains provenance rather than last-writer-wins resolution;
6. a conformance PASS identifies subject, profile, evaluator and revision vector and becomes stale when an affected revision advances;
7. an OCI digest proves exact content but does not satisfy runtime compatibility, semantic validity or authorization;
8. OpenTelemetry-like old/new representations coexist while consumer-population drain evidence is incomplete;
9. provider replacement preserves portable semantic identity while producing new realization/conformance evidence;
10. incompatible evidence qualifiers make composite proof INCONCLUSIVE;
11. an offline Station operates only inside qualified local closure and requalifies after reconnect changes trust/policy/provider state;
12. AGWS AI materialization cannot turn a visibility/composition request into canonical domain/process mutation or broaden Enterprise→Station→Role→Person authority.

## Findings — revisit 6 / cycle 7
- **G2-FINDING-UCA-44 — Universal Product Truth Is a Typed Applicability-Scoped Claim Graph, Not a Global Truth Store:** decisions, observations, contracts, realizations and proofs have different semantic owners and applicability; reconciliation links them without collapsing them.
- **G2-FINDING-UCA-45 — Claim Applicability and Evidence Availability Are Independent Axes:** Kubernetes-style history compaction can make prior evidence unreplayable without falsifying the historical claim; proof semantics require an explicit evidence-retention horizon.
- **G2-FINDING-UCA-46 — Constraint Compatibility Does Not Establish Semantic Authority:** CUE-style independent constraint composition can prove consistency while authority to impose each constraint remains separately governed.
- **G2-FINDING-UCA-47 — Conformance Is a Revision-Qualified Relation, Not an Intrinsic Artifact Boolean:** subject, normative contract/profile, evaluator, scope, revisions and evidence must all be identified for a conformance claim to be meaningful.
- **G2-FINDING-UCA-48 — Stability and Support Are Typed Surface Vectors, Not Release-Wide Scalars:** OpenTelemetry mixed component stability and independent version streams show that one release can contain surfaces with different compatibility/support obligations.
- **G2-FINDING-UCA-49 — Semantic Continuity May Require Dual Representation and Consumer-Population Evidence:** staged schema/semantic migration can require old and new representations to coexist until affected consumers are proven drained or translated.
- **G2-FINDING-UCA-50 — Cryptographic/Content Integrity Is Narrower Than Semantic Validity, Admission and Authority:** OCI digest identity proves bytes, not capability semantics, runtime suitability, policy admission, trust or actuation authority.
- **G2-FINDING-UCA-51 — Historical Decision/Evidence Identity Should Be Append-and-Supersede While Applicability Evolves:** immutable decision history and fresh observations coexist; newer applicability must not rewrite prior evidence or findings.

## Capability Discovery candidates
- `G2-CAPABILITY-CANDIDATE-UCA-TYPED-CLAIM-APPLICABILITY-GRAPH` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with Architecture Reconciliation, Governance, Observability and Lifecycle before synthesis.
- `G2-CAPABILITY-CANDIDATE-UCA-EVIDENCE-RETENTION-AVAILABILITY-HORIZON` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with Observability, Security/Recovery and local/offline closure.
- `G2-CAPABILITY-CANDIDATE-UCA-MIXED-STABILITY-SUPPORT-VECTOR` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with Standards/Lifecycle/Extension/Provider support semantics.
- `G2-CAPABILITY-CANDIDATE-UCA-SEMANTIC-CONTINUITY-DUAL-REPRESENTATION` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with Standards, Lifecycle, Data and consumer-population migration evidence.

No candidate is promoted in this revisit. Adaptive Governed Work Surfaces remains promoted and distinct.

## Architecture proof backfill — UCA revisit 6
Status: `PARTIAL`; new proof obligations are explicit but not executable implementation work:
1. typed product-truth claims retain distinct semantic owners and applicability;
2. retention expiry cannot be misclassified as claim falsification;
3. constraint composition retains provenance and requires separate canonicalization authority;
4. conformance proof binds subject/profile/evaluator revisions;
5. mixed stability surfaces remain independently governable;
6. dual representation cannot be closed until consumer-population compatibility/drain is evidenced;
7. content digest cannot satisfy semantic/admission/authority obligations by implication;
8. decision supersession preserves historical evidence/finding identity;
9. incompatible qualifiers propagate INCONCLUSIVE;
10. local/offline closure expires/requalifies by trust/evidence horizon;
11. provider change invalidates only affected realization/conformance claims;
12. AGWS preserves its nine mandatory proofs and non-amplifying Enterprise→Station→Role→Person authority.

## Saturation judgment
Material new findings were produced, so `consecutive_no_material_finding=0`. Universal Capability Architecture remains **NOT SATURATED**. Principal representative coverage in this revisit is DEEP, but the saturation rule requires two consecutive eligible revisits without material new architectural findings or a repository-validation-only remainder.

## Value / risk / priority / next question
Value: prevents Generation 2 from turning its cross-cutting abstractions into an accidental universal engine or false single source of truth. Risk if omitted: evidence expiry may be treated as falsification; conformance can become an unqualified boolean; constraint composition can be mistaken for authority; mixed-stability surfaces can be over-promised; and byte integrity can be promoted into semantic trust. Priority: constitutional/cross-cutting. Next question: continue the authoritative cycle-7 rotation with exactly the next capability selected by pipeline state; do not enter Enterprise Completeness until all 25 cycle-7 revisits complete.
