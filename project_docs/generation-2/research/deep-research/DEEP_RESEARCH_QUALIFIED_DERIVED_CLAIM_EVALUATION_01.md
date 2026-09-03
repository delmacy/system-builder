# Generation 2 Deep Research — Qualified Derived-Claim Evaluation 01

Status: COMPLETE — RESEARCH RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY

## Question

Generation 2 repeatedly encounters a relation of the form:

```text
subject revision
+ evaluator/profile/policy revision
+ evidence/input closure
+ applicability/freshness
      ↓
qualified derived claim
```

Should this become one small universal UCA primitive, or should burden assessments, policy decisions, conformance results, readiness conditions, generated-UI validation, historical-interpretation results, commercial rating and similar outcomes remain unrelated domain-specific records?

## Why this is architecturally material

If G2 fails to generalize enough, every capability may independently reinvent stale-result handling, evaluator lineage, evidence closure, `INCONCLUSIVE`, provider substitution, historical applicability and replay semantics. Cross-capability proof composition then becomes brittle.

If G2 generalizes too far, a generic `Evaluation` object can erase the exact domain semantics that matter: who is authorized to decide, which predicates are normative, what `PASS`, `DENY`, `READY`, `COMPLIANT`, `RATED` or `SAFE` mean, whether the result permits actuation, and how result lifecycle/revocation works.

This question therefore tests the boundary between UCA-owned evidence/provenance structure and capability-owned decision semantics.

## Corpus of SB input

Mandatory corpus reviewed before external research:

- `RESEARCH_PIPELINE_STATE.json` — `phase=RESEARCH_ELICITATION`; six full cycles complete; cycle 7 active. Deep Research must not alter rotation counters or saturation.
- `RESEARCH_EVIDENCE_METHOD.md` — universal primitives require multi-source corroboration or structural necessity; preserve divergences.
- `ARCHITECTURE_PROOF_QUALITY_METHOD.md` — every material claim needs observable proof, falsification path and retained evidence; CAPABILITY_SYNTHESIS must demonstrate primitive reuse across domains.
- `CAPABILITY_DISCOVERY_REGISTER.md` and `FINDING_INDEX.md` — compact inventories preserve historical candidates/findings and do not revoke earlier dossiers.
- `CAPABILITY_PROOF_MATRIX.md` — UCA proof debt explicitly includes primitive reuse, evidence qualification, authority separation and provider neutrality.
- `UNIVERSAL_CAPABILITY_ARCHITECTURE_REVISIT_06.md` — strengthens `TypedClaim`, `EvidenceQualification`, revision-qualified conformance, evidence-compatibility joins, `INCONCLUSIVE`, applicability and evidence-retention horizons while explicitly rejecting a universal conformance runner.
- prior Deep Research artifacts, especially `DR-LGCE-01`, `DR-HIC-01`, `DR-CURB-01`, `DR-ROCMR-01` and `DR-OBPM-01`, which independently converged on revision-qualified interpreted/derived results without making their domain evaluator universally authoritative.

## External evidence ledger

### 1. IETF RATS Architecture — RFC 9334
Source: https://www.rfc-editor.org/rfc/rfc9334.html

RATS separates Evidence, Verifier, Appraisal Policy for Evidence, Attestation Result, Relying Party, and a second Appraisal Policy for Attestation Results. The verifier-derived result can be vendor-neutral even when device evidence is vendor-specific. Freshness and policy integrity are explicit concerns.

Architectural extraction: a reusable evaluation envelope exists, but verifier appraisal and relying-party authorization remain separate semantic acts. An attestation result does not automatically authorize anything.

### 2. in-toto Attestation Framework — Statement v1 and Simple Verification Result
Sources:
- https://github.com/in-toto/attestation/blob/main/spec/v1/statement.md
- https://github.com/in-toto/attestation/blob/main/spec/predicates/svr.md

The Statement layer universally binds `subject` to a typed predicate. The Simple Verification Result adds verifier identity, policies, creation time and verified properties, while explicitly noting that it does not itself contain enough information to reproduce verification unless additional provenance is retained.

Architectural extraction: subject binding and typed predicate envelope generalize well; verification-result semantics and reproducibility closure remain predicate/evaluator-specific.

### 3. W3C PROV-O / PROV-DM
Sources:
- https://www.w3.org/TR/prov-o/
- https://www.w3.org/TR/prov-dm/

PROV provides domain-agnostic Entity / Activity / Agent lineage and qualified relations while recommending the most specific relation when semantics are known. Domain extensions remain possible without requiring PROV to understand their complete meaning.

Architectural extraction: provenance of evaluation is universalizable; the domain predicate being evaluated should remain specialized.

### 4. Open Policy Agent decision logs
Source: https://www.openpolicyagent.org/docs/management-decision-logs

OPA decision logs can retain policy queries with decision ID, input and bundle metadata/revision for auditing and offline debugging.

Architectural extraction: policy decisions need input/policy/evaluator lineage. However, OPA's permit/deny/data result is policy-domain semantics and cannot become the universal meaning of an evaluation record.

### 5. NIST OSCAL Assessment Results
Source: https://pages.nist.gov/OSCAL/learn/concepts/layer/assessment/assessment-results/

OSCAL structures a system-specific assessment in the context of an assessment plan, assessment activities, observations/evidence, findings and risks. A finding is derived from observations and control objectives, but the assessment model preserves the security/compliance vocabulary and its ownership.

Architectural extraction: scope, plan/profile, activity, observations and findings form another qualified derived-claim pattern, yet findings are not interchangeable with authorization decisions or runtime readiness.

### 6. Kubernetes Conditions / observedGeneration
Sources:
- https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions
- https://kubernetes.io/docs/reference/kubernetes-api/apps/deployment-v1/

Conditions use typed status (`True|False|Unknown`), reason/message, transition time and observed generation. `observedGeneration` prevents consumers from confusing a valid-looking condition calculated for an older desired-state generation with current reconciliation.

Architectural extraction: revision-qualified status is strongly reusable; Kubernetes condition polarity/types and controller semantics are not universal business predicates.

### 7. OpenFeature evaluation details
Sources:
- https://openfeature.dev/specification/sections/flag-evaluation/
- https://openfeature.dev/specification/types/

Feature-flag evaluation returns a value plus optional variant, reason, error and metadata under provider-defined resolution. The specification standardizes result shape sufficiently for provider portability while leaving actual flag semantics and provider evaluation mechanics outside the generic envelope.

Architectural extraction: common result qualification can improve portability, but value/reason/error alone are far too weak for G2 proof semantics.

## Competing models

### Model A — No universal evaluation abstraction
Each capability defines its own record: `PolicyDecision`, `ConformanceResult`, `ReadinessCondition`, `BurdenAssessment`, `RatingResult`, etc.

Strongest evidence for:
- domains genuinely differ in authority, predicate vocabulary, lifecycle and effects;
- RATS itself separates verifier appraisal from relying-party decision;
- OSCAL findings, OPA decisions and Kubernetes conditions are not semantically substitutable.

Strongest evidence against:
- all independently require some combination of subject identity/revision, evaluator/policy/profile, evidence/input lineage, time/applicability and outcome qualification;
- without a shared relation, cross-capability evidence joins and historical replay duplicate infrastructure and can disagree about staleness/unknown semantics.

Disposition: **REJECT as complete architecture**. Domain-specific records remain necessary, but denying the repeated universal relation would leave avoidable duplication.

### Model B — Universal generic `Evaluation` object owns subject, inputs, logic, result and status

Strongest evidence for:
- superficially matches OPA, OSCAL, RATS, conditions and burden assessments;
- simplifies APIs and storage.

Strongest evidence against:
- collapses evaluator execution authority with semantic authority;
- invites generic `PASS/FAIL/SUCCESS` as if results were interchangeable;
- risks turning a conformance result into admission/authorization, an attestation result into access authority, or a rating result into architectural truth;
- cannot provide one universal lifecycle or freshness rule without weakening domains;
- contradicts UCA's existing rejection of a universal conformance runner.

Disposition: **DO_NOT_BUILD**.

### Model C — Small universal `QualifiedClaimDerivation` / `AssessmentEvidence` relation; domain-specific predicate/result remains owned by the capability

Conceptual shape, not frozen IR:

```text
DerivedClaim
  subject: typed reference + subject revision/scope
  claimKind: domain-owned predicate/result type
  evaluator: evaluator identity/revision
  profileOrPolicy: typed reference/revision when applicable
  inputs: evidence/claim references or an input-closure identity
  qualification:
    observed/evaluated time
    applicability/freshness horizon
    coverage/assurance/uncertainty as domain-qualified facets
  provenance
  resultPayload: domain-owned schema
```

The UCA primitive says **how a derived claim is bound and qualified**, not **what the domain result means**.

Disposition: **GENERALIZE / KEEP SMALL**.

## Strongest synthesis

The evidence supports a universal relation, but not a universal evaluator.

A more precise constitutional rule is:

> **UCA may standardize the provenance and qualification of a derived claim; the owning capability defines the predicate, evaluation semantics, authority, acceptance threshold, lifecycle and actuation consequences.**

Equivalent shorthand:

```text
UCA owns: who/what/which revision/using which inputs/when/under which applicability
Domain owns: what was decided and what that decision permits or proves
```

This reconciles the repeated G2 pattern without introducing a semantic mega-object.

## Contradictions resolved

### Conformance versus authorization
RATS directly demonstrates that a verifier's attestation result is input to a relying party, which applies another policy. Therefore a derived claim can support a downstream decision but cannot automatically inherit its authority.

Resolution: `supports` / `consumedBy` relations may be universal; semantic admission remains downstream-owned.

### Historical validity versus current applicability
Kubernetes `observedGeneration`, OPA bundle revision and the G2 multi-axis revision work all show that a result may be historically valid for one revision while stale for the current subject/policy.

Resolution: preserve immutable historical derived claim + explicit current applicability evaluation; never mutate history to pretend it evaluated a later revision.

### Reproducibility versus mere provenance
in-toto SVR explicitly allows verification results that do not by themselves contain enough material for reproduction.

Resolution: `replayability/reproducibility` must be a qualified property backed by input/evaluator closure, not inferred merely because a result has provenance.

### Provider result versus semantic result
OpenFeature standardizes evaluation details across providers, while domain meaning stays with the flag definition/application. RATS similarly maps heterogeneous evidence into verifier results.

Resolution: providers may realize evaluators or emit evidence, but portable claim meaning belongs to the capability/profile.

## Invariants

1. **No result-type erasure:** domain predicate/result identity must survive generic wrapping.
2. **No authority amplification:** evaluator execution, evidence production or `PASS` never grants mutation/admission authority unless the owning domain explicitly defines and authorizes that consequence.
3. **Subject binding:** every material derived claim identifies exact subject/scope and applicable subject revision(s).
4. **Evaluator/profile binding:** material claims identify evaluator and relevant policy/profile revision; `latest` is insufficient historical identity.
5. **Evidence/input closure:** a result records enough input lineage to establish what evidence/claims it actually depended on, or explicitly marks reproduction/coverage incomplete.
6. **Historical immutability:** re-evaluation creates another claim; it does not rewrite the earlier evaluation.
7. **Applicability is separate from truth:** a historically correct claim can be stale/inapplicable now.
8. **Unknown is first-class:** missing/stale/incompatible evidence must support `INCONCLUSIVE/UNKNOWN` where the domain requires it; absence must not silently become false/pass.
9. **Contradictions survive:** conflicting qualified claims may coexist until an authorized domain disposition reconciles them.
10. **Provider neutrality is claim-specific:** replacing an evaluator/provider requires conformance to the same domain predicate/profile or an explicit migration/requalification.
11. **No universal PASS vocabulary:** result payload and accepted states belong to the domain.
12. **Simple-system ergonomics:** the primitive must work as one local deterministic function plus evidence record; distributed attestation infrastructure is optional realization.

## Failure / adversarial analysis

- **Stale result replay:** an attacker reuses a valid `READY` claim from subject revision S1 against S2. Must fail applicability join.
- **Evaluator downgrade:** provider substitution maps a strong conformance predicate to a weaker check but preserves generic `PASS`. Must be rejected unless predicate/profile equivalence is proven.
- **Authority confusion:** an AI validator produces `VALID` and attempts canonical mutation. Validation claim alone cannot confer actuation authority.
- **Input omission:** evaluator silently ignores a required dependency and still emits PASS. Evidence closure/coverage must expose the missing requirement or result becomes `INCONCLUSIVE`.
- **Policy latest rewrite:** historic policy decision is reinterpreted under latest policy without preserving original. Forbidden; re-evaluation creates new lineage.
- **Conflicting evaluators:** E1 says compliant, E2 says non-compliant under different profiles/revisions. Generic last-writer-wins is forbidden.
- **Expired evidence:** historical result persists after source evidence retention expires. It may remain historical evidence but reproducibility/validation strength can degrade.
- **Cached materialization corruption:** derived-claim index/read model diverges from canonical claims/evidence. Rebuild must restore result set from immutable assessment records/source graph where replayability is claimed.
- **Cross-domain laundering:** a commercial `RATED=LOW` result is presented as `SECURITY_RISK=LOW`. Claim kind/profile mismatch must reject composition.
- **Offline Station:** local evaluator produces claim under retained closure; reconnect changes trust/policy. Historical local claim remains, future privileged consumption requires requalification according to domain rules.

## Provider-specific versus portable semantics

Portable:
- typed subject and scope;
- subject revision binding;
- evaluator identity/revision;
- policy/profile reference where meaningful;
- input/evidence lineage or closure identity;
- evaluation time and applicability/freshness qualification;
- immutable derived-claim identity/provenance;
- explicit domain predicate/result type;
- contradiction/supersession/support relations;
- uncertainty/inconclusive capability.

Provider/domain-specific:
- Rego decision values and rule evaluation;
- RATS attestation evidence formats and trust roots;
- OSCAL control objectives/findings/risks;
- Kubernetes condition types/polarity/reconciliation logic;
- OpenFeature flag resolution algorithms/variants;
- burden dimensions/weights;
- commercial pricing/rating formulas;
- conformance test implementation;
- readiness thresholds;
- authorization permit/deny/obligations.

## Consequences for existing G2 findings/candidates

- **KEEP/HARDEN** `TypedClaim`, `EvidenceRecord`, `EvidenceQualification`, `EvidenceCompatibility/CompositeProofJoin` from UCA.
- **GENERALIZE** a small qualified-derived-claim relation that binds a domain-owned result to subject/evaluator/profile/input closure/applicability/provenance.
- **MERGE** `BurdenAssessment` into this structural pattern while retaining MeasurementProfile and burden-vector semantics in their owners.
- **MERGE** relational conformance claims into the same structural envelope; conformance predicate/profile remains Standards/capability-owned.
- **KEEP DISTINCT** Authorization decisions, RATS-like trust appraisal, readiness, burden measurement, commercial rating, AGWS validation and architecture reconciliation dispositions.
- **PROVIDERIZE** OPA/RATS/OpenFeature/Kubernetes/OSCAL/in-toto mechanisms and serialized schemas.
- **DO_NOT_BUILD** generic evaluator engine, universal `PASS/FAIL`, universal score, automatic downstream authority, or one lifecycle for all evaluations.
- **DEFER** exact final primitive name/schema until Capability Synthesis proves reuse against at least three materially different domains.

No new top-level capability is recommended.

## Proof obligations — DR-QDCE

### DR-QDCE-01 — Cross-domain primitive reuse
Represent one Authorization decision, one conformance result and one BurdenAssessment with the same generic qualification/provenance relation while preserving three different domain result schemas. Pass only if no domain loses required semantics.

### DR-QDCE-02 — Result-type mismatch
Attempt to satisfy an authorization obligation with a conformance PASS having otherwise compatible revisions/evidence. Must reject by predicate/result kind.

### DR-QDCE-03 — Stale subject revision
Create result for S1, advance subject to S2, and consume where current revision is mandatory. Historical claim remains addressable but consumption fails/stales.

### DR-QDCE-04 — Stale evaluator/profile
Create result under profile P1; advance mandatory profile to P2. No silent carry-forward.

### DR-QDCE-05 — Missing required input
Remove one required evidence dependency. Evaluator may produce diagnostic output, but qualified final result must become incomplete/`INCONCLUSIVE` when the domain requires full closure.

### DR-QDCE-06 — Conflicting qualified claims
Two authorized evaluators produce contradictory results under different revisions/profiles. Both survive; no generic last-writer-wins.

### DR-QDCE-07 — Evaluator authority non-amplification
Grant evaluator read/evaluate authority but no mutation/admission authority. Successful evaluation cannot actuate canonical mutation.

### DR-QDCE-08 — Provider substitution
Two materially different evaluator providers satisfy the same normative predicate/profile. Claim semantics remain stable; evaluator/provenance changes.

### DR-QDCE-09 — Weaker provider rejection
Second provider cannot prove one mandatory predicate dimension. Must report partial/unsupported/inconclusive, never translate its weaker PASS into full conformance.

### DR-QDCE-10 — Reproducibility qualification
Persist a result with exact evaluator/profile/input closure and replay deterministically. Then repeat with one hidden mutable external input; result must not claim equivalent reproducibility.

### DR-QDCE-11 — Evidence retention expiry
Expire source evidence while retaining historical result. System distinguishes historical claim retention from ability to reconstruct/revalidate it.

### DR-QDCE-12 — Re-evaluation lineage
Re-evaluate same subject under new evaluator/profile. Produce a new derived claim linked by supersession/re-evaluation relation; original remains immutable.

### DR-QDCE-13 — Cross-domain laundering adversary
Present `commercial.rating=LOW` as evidence for `security.risk=LOW`. Generic composition rejects semantic mismatch even if subject/time coincide.

### DR-QDCE-14 — Offline Station requalification
Generate a locally valid qualified claim under declared offline closure; alter trust/policy while disconnected; reconnect must preserve historical local evidence but requalify privileged future consumption.

### DR-QDCE-15 — Inconclusive propagation
Composite proof consumes one PASS and one incompatible/stale required derived claim. Overall proof becomes `INCONCLUSIVE` rather than PASS-by-count.

### DR-QDCE-16 — Simple-system ergonomics
Implement acceptance later using a single-process evaluator and local records with no broker/attestation service/OLAP dependency. Same semantic envelope must scale to provider-backed realization without changing domain meaning.

### DR-QDCE-17 — Cached projection corruption
Corrupt/delete the materialized query/index of evaluations. Canonical source assessment records/claim graph can rebuild it where replay closure exists; materialization is not semantic authority.

### DR-QDCE-18 — AI/AGWS validation boundary
AI-generated surface candidate obtains deterministic VALID result but requests a canonical domain mutation outside delegated authority. Validation remains evidence; mutation is denied/escalated.

## Falsification paths for the recommendation

The proposed small universal relation should be rejected or narrowed during synthesis if any of the following is demonstrated:

1. three materially different domains cannot share subject/evaluator/profile/evidence/applicability provenance without introducing meaningless mandatory fields;
2. the generic relation requires a universal result vocabulary to be useful;
3. provider substitution cannot preserve the relation independently of domain-specific evaluator semantics;
4. it creates circular authority where an evaluation record decides who may define/evaluate that same predicate;
5. simple systems require materially more ceremony than specialized records alone;
6. cross-capability proof joins gain no measurable semantic/reproducibility benefit from the shared qualification shape.

Conversely, retaining only specialized records should be rejected if later proof shows repeated stale-revision, evaluator-lineage or evidence-closure bugs across domains that the shared relation eliminates without semantic loss.

## Confidence

**HIGH** that subject/evaluator/profile/input/applicability/provenance qualification is a repeated provider-neutral architectural relation.

**HIGH** that a generic evaluator engine or universal result vocabulary would be an over-generalization.

**MEDIUM-HIGH** that this deserves an explicit UCA primitive rather than remaining a documentation convention; final promotion should wait for Capability Synthesis cross-domain proof (`DR-QDCE-01`).

## Proposed research dispositions

- **GENERALIZE:** small UCA qualified-derived-claim relation/envelope.
- **MERGE:** burden/conformance/readiness/policy-evaluation provenance into that envelope where structurally compatible.
- **SPECIALIZE:** domain predicate, result schema, thresholds, lifecycle, freshness rules and actuation consequences.
- **PROVIDERIZE:** evaluator engines, provider result formats, attestation protocols and materialized query infrastructure.
- **KEEP:** domain semantic ownership and independent downstream authority.
- **DEFER:** exact primitive name and canonical IR shape until Capability Synthesis.
- **DO_NOT_BUILD:** universal evaluator engine, universal `PASS/FAIL/SUCCESS`, automatic authority from evaluation success, or provider-native decision identity as canonical business meaning.

## Unresolved questions

1. Should input closure be represented as explicit evidence refs, a content-addressed closure artifact, or both depending on scale/privacy?
2. Which qualification facets belong universally versus optional typed extensions (`coverage`, `assurance`, `uncertainty`, `freshness`, `consistency profile`)?
3. Should contradiction/re-evaluation/supersession be direct `ClaimRelation` values or specialized lifecycle relations?
4. How should privacy disposition redact subject-bearing evaluation inputs while preserving enough closure for historical interpretation?
5. Which domains legitimately allow a derived claim itself to be an authority input, and what prevents recursive/confused-deputy evaluation?
6. Can one portable conformance suite prove that at least Authorization, Standards/Conformance and Operational Burden reuse the primitive without coupling their semantic owners?

## Research recommendation

Promote **the relation, not the engine** during Capability Synthesis if the cross-domain proof succeeds.

The target architectural principle should remain:

> **Own domain semantics and authority; standardize qualified claim provenance and compatibility; delegate evaluation mechanics to mature providers where appropriate.**
