# Generation 2 — Artifact-to-Runtime Admission Centralized Proof

Status: RESOLVED_BY_MULTI_REPRESENTATIVE_RESEARCH
Phase: RESEARCH_ELICITATION / Enterprise Completeness architecture-proof backfill
Scope: proof junction only; no Construction, Work Package or executive TASK materialization

## Research question
What must be true before a release-qualified artifact is allowed to become the intended effective runtime generation, and how must the system behave when artifact provenance, verifier trust, configuration, schema, provider bindings or deployment outcome are stale, mismatched or ambiguous?

## Conclusion
Artifact admission and runtime realization are distinct transitions. A cryptographically identified artifact with valid provenance is necessary but insufficient for runtime acceptance. The intended runtime generation is qualified only when the release artifact, RuntimeRealizationPlan, provider bindings, configuration, trust material, schema/contracts, operational profile and admission policy are all bound to explicit revisions and the observed runtime reports the intended generation/effective realization. Any stale, untrusted, mismatched or unverifiable prerequisite must DENY or yield INCONCLUSIVE; an ambiguous deployment effect must be reconciled from observed state before retry.

The proof does not create a new top-level capability. Ownership remains distributed: Artifact/Provenance owns release identity and provenance evidence; Enterprise Trust owns verifier/trust qualification; Provider Binding owns implementation bindings; Secrets/Configuration and Standards/Contracts own their effective revision claims; Deployment owns desired-to-observed realization and rollout; Observability supplies current observed evidence; Lifecycle owns replacement/drainage. `RuntimeAdmissionQualification` is therefore a cross-capability proof/contract, not a semantic owner.

## Strong representatives and evidence ledger

| Representative | Relevant mechanism | Architectural evidence |
|---|---|---|
| SLSA v1.2 | artifact verification against provenance expectations | Verification is bound to artifact/package identity, provenance and verifier expectations. Missing provenance or mismatch between artifact digest and attested subject is verification failure; provenance alone is not equivalent to deployment realization. |
| Sigstore policy-controller | Kubernetes admission from signatures/attestations | Admission evaluates signatures/attestations and matching authorities/policies, and resolves image tags to digests so the image run cannot silently differ from the admitted artifact. A custom TUF root changes the verifier trust basis. |
| Kubernetes Deployment / Pod status | desired generation vs observed generation | `status.observedGeneration` is explicitly the generation observed by the controller/kubelet. Deployment completion additionally depends on updated/available replicas and absence of old running replicas; desired spec write is therefore not sufficient proof of effective realization. |
| SPIFFE bundles/federation | trust-bundle currentness and rotation | Trust keys are rotated by publishing new bundles and distributing them to workloads; consumers are expected to use the latest available bundle for subsequent validation. Presence of old trust bytes cannot imply current trust qualification. |
| Existing Provider/Binding research | requirement → offer → binding → provider realization → consumer-effective satisfaction | Provider health or nominal binding existence is narrower than effective consumer satisfaction; binding and realization revisions must participate in qualification. |
| Existing Deployment/Runtime research | release/admission/attempt/realization/traffic/readiness identities | Runtime realization, traffic binding and readiness are distinct identities; ambiguous rollout/traffic outcomes require reconcile-before-retry and residual cohorts must be drained/dispositioned. |

Primary external sources:
- SLSA v1.2 Build — Verifying artifacts: https://slsa.dev/spec/v1.2/verifying-artifacts
- SLSA threats/mitigations: https://slsa.dev/spec/draft/threats
- Sigstore Kubernetes policy-controller: https://docs.sigstore.dev/policy-controller/overview/
- Sigstore policy-controller installation/custom TUF root: https://docs.sigstore.dev/policy-controller/installation/
- Kubernetes Deployment API/status: https://kubernetes.io/docs/reference/kubernetes-api/apps/deployment-v1/
- Kubernetes Deployments: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
- Kubernetes Pods observedGeneration: https://kubernetes.io/docs/concepts/workloads/pods/
- SPIFFE Federation: https://spiffe.io/docs/latest/spiffe-specs/spiffe_federation/
- SPIFFE Trust Domain and Bundle: https://spiffe.io/docs/latest/spiffe-specs/spiffe_trust_domain_and_bundle/

## Universal primitives
1. `ReleaseArtifactIdentity`: immutable digest plus logical release/package identity.
2. `ArtifactQualificationEvidence`: provenance/signature/attestation result bound to verifier, policy, expectations and trust-root revision.
3. `RuntimeRealizationPlan`: revisioned desired mapping from semantic capability closure + OperationalProfile to artifact set, provider bindings, configuration/schema/trust requirements and target runtime topology.
4. `RuntimeAdmissionQualification`: applicability-scoped decision over the complete prerequisite revision vector.
5. `DesiredRuntimeGeneration`: generation/revision intended by the accepted plan.
6. `ObservedRuntimeGeneration`: controller/runtime-observed generation plus effective replica/route/readiness evidence.
7. `RuntimeQualificationEvidence`: evidence that desired and observed generation/effective realization converge under the currently qualified prerequisite vector.
8. `ReconciliationResult`: authoritative observation used after ambiguous actuation before retry.

## Source of truth and identity
There is no single scalar source of truth. Artifact identity is digest-addressed; provenance is attestation evidence; desired runtime state is plan/generation-addressed; observed runtime state is controller/runtime evidence. Effective runtime qualification is relational:

`QualifiedRuntime = f(releaseArtifactDigest, provenance/verifier/policy/trustRootRevision, realizationPlanRevision, bindingRevisionSet, configRevisionSet, trustRevisionSet, schemaContractRevisionSet, operationalProfileRevision, desiredGeneration, observedGeneration, runtimeEvidenceRevision)`

A change to any controlling member invalidates prior qualification unless explicit equivalence evidence proves otherwise.

## Lifecycle
`BUILT → RELEASE_QUALIFIED → ADMISSION_EVALUATED → ADMITTED → REALIZATION_ATTEMPTED → OBSERVED → EFFECTIVE_QUALIFIED`

Side outcomes are first-class: `DENIED`, `INCONCLUSIVE`, `AMBIGUOUS_EFFECT`, `RECONCILING`, `DEGRADED`, `ROLLED_BACK`, `DRAINING`, `SUPERSEDED`.

Admission never directly implies `EFFECTIVE_QUALIFIED`. A previously qualified runtime becomes stale when a controlling revision changes, even if its bytes/processes continue running.

## Versioning/currentness rules
- Artifact digest/version and release logical identity are distinct.
- Provenance/verifier policy/trust-root revision participates in qualification; a valid historical signature under a no-longer-qualified verifier root cannot silently authorize a new admission.
- Config, trust bundle, schema/contract and provider-binding revisions are independent members of the admission vector.
- Desired generation and observed generation must be compared; old status evidence cannot qualify a newer desired generation.
- Runtime evidence has a currentness horizon. Reuse beyond that horizon is `INCONCLUSIVE` until refreshed/requalified.

## Failure semantics
- Digest mismatch, missing required provenance, unacceptable builder/verifier/attestation, or policy mismatch: `DENY`.
- Verifier root/trust status cannot be established at required freshness: `INCONCLUSIVE` or `DENY` according to policy; never implicit allow.
- Required config/trust/schema/binding currentness cannot be established: `INCONCLUSIVE`/`DENY`.
- Deployment API/actuator times out after submission: `AMBIGUOUS_EFFECT`; observe/reconcile desired and actual generation before retry.
- Observed generation lags desired generation: `PENDING/RECONCILING`, not success.
- Desired generation is observed but readiness/effective binding evidence fails: `DEGRADED/FAILED`, not qualified.
- Rollback changes the effective generation and requires a fresh qualification against the rollback artifact and controlling revision vector.

## Provider boundaries, portability and lock-in
Artifact qualification should remain provider-neutral at the semantic contract level: digest, provenance expectation, trust-root identity, plan revision and observed-generation proof are universal primitives. Sigstore, Kubernetes, a cloud deployment API, VM/process supervisors or future providers are mechanisms. Provider adapters MAY supply realization/evidence, but MUST NOT redefine canonical release identity, weaken policy, or translate `unknown` into `allow`.

Provider substitution changes at least binding/provider/evidence-support revisions and therefore forces requalification. Portability is proven by preserving the same release/plan semantics across different providers while obtaining provider-specific observed realization evidence.

## Governance and authority
`Enterprise → Station → Role → Person` remains the authority chain. A Station may execute an already-authorized admission/realization within delegated policy, but cannot weaken enterprise provenance, trust, schema, provider or release requirements. Adaptive Governed Work Surfaces and AI may propose, explain, collect evidence and materialize views; they cannot grant release authority, mutate verifier roots, waive failed admission predicates, choose privileged provider-admin credentials, or convert INCONCLUSIVE into success.

## Observability
Required evidence must expose at minimum: logical release; artifact digest; provenance/attestation identity; verifier and trust-root revision; admission policy revision; RuntimeRealizationPlan revision; desired generation; observed generation; binding/config/trust/schema revision sets; rollout/readiness/effective-provider evidence; decision state; observation timestamp/horizon; reconciliation lineage; residual cohorts.

A green health signal without matching desired/observed generation and prerequisite revision vector is insufficient proof.

## Convergent patterns
- Immutable/digest artifact identity is distinct from logical package/release identity.
- Verification evaluates evidence against expectations/policy/trust, not mere signature presence.
- Admission is distinct from execution/realization.
- Controllers expose desired-vs-observed state because writes are asynchronous.
- Trust/configuration can rotate independently from the artifact.
- Effective qualification is revision- and evidence-qualified.

## Divergent/provider-specific mechanisms
- Sigstore `ClusterImagePolicy`, authorities and TUF root are provider mechanisms, not universal primitives.
- Kubernetes `metadata.generation`/`status.observedGeneration`, ReplicaSets and readiness conditions are one runtime-controller realization.
- SPIFFE bundle endpoints/refresh hints are one trust-distribution mechanism.
- Rollout strategy, traffic splitting and specific health-condition schemas remain Deployment/provider mechanisms.

## Findings
- **G2-FINDING-ATRA-01** — Release artifact qualification and runtime realization are separate transitions; admission success never proves intended runtime generation became effective.
- **G2-FINDING-ATRA-02** — Artifact admission must bind immutable artifact identity to provenance/verifier expectations, admission-policy revision and verifier trust-root revision; digest validity alone is insufficient.
- **G2-FINDING-ATRA-03** — Runtime admission/effectiveness is an applicability-scoped multi-revision qualification over artifact, plan, bindings, config, trust, schema/contracts, operational profile, desired generation, observed generation and evidence currentness.
- **G2-FINDING-ATRA-04** — Desired state writes are asynchronous claims; effective success requires observed-generation convergence plus readiness/effective-binding evidence for that same generation.
- **G2-FINDING-ATRA-05** — Stale or unverifiable provenance expectations, verifier roots, configuration, trust bundles, schema/contracts or provider bindings must DENY or yield INCONCLUSIVE; unknown cannot be normalized to allow.
- **G2-FINDING-ATRA-06** — Ambiguous deployment/rollout effects require observe-and-reconcile-before-retry to prevent duplicate/conflicting actuation and generation drift.
- **G2-FINDING-ATRA-07** — Rollback/provider substitution/cutover creates a new qualification event and cannot close until residual runtime/traffic/session/cache/subscription cohorts are drained, requalified or explicitly dispositioned.
- **G2-FINDING-ATRA-08** — RuntimeAdmissionQualification is a cross-capability proof contract, not a new semantic-owner capability; AGWS/AI may assist evidence/proposal surfaces but cannot amplify release, trust-root, policy-waiver or provider-admin authority.

## Symbiotic Proof / falsification matrix
| Case | Expected result |
|---|---|
| Correct digest + acceptable provenance + current verifier root + current plan/bindings/config/trust/schema + observed intended generation + readiness/effective binding | `EFFECTIVE_QUALIFIED` |
| Correct digest but provenance subject/builder/expectation mismatch | `DENY` |
| Correct artifact/provenance but verifier root is stale/untrusted/unknown | `DENY` or `INCONCLUSIVE`, never allow |
| Correct artifact but required config/trust/schema generation is stale | `DENY`/`INCONCLUSIVE`; running old generation is not newly qualified |
| Admission accepted but controller `observedGeneration < desiredGeneration` | `PENDING/RECONCILING` |
| Desired generation observed but runtime readiness/effective provider binding fails | `DEGRADED/FAILED`, not qualified |
| Deployment request times out with unknown external effect | `AMBIGUOUS_EFFECT → RECONCILE`; do not blind-retry |
| Provider substitution preserves artifact/plan semantics but changes binding/evidence provider | fresh provider-support and effective-realization qualification required |
| Offline Station lacks current trust/config/schema evidence beyond permitted horizon | `INCONCLUSIVE`/degraded/deny per higher policy; no local waiver |
| AI/AGWS recommends admission despite failed provenance/trust predicate | recommendation cannot authorize; authoritative result remains denied/inconclusive |

## Repo-validation questions
1. Does current SB release/artifact identity remain digest-bound through registry/publish/retrieval and deployment handoff?
2. Is there an explicit `RuntimeRealizationPlan` or equivalent revisioned contract linking artifact closure, provider bindings, config/trust/schema and OperationalProfile?
3. Can runtime status prove desired vs observed generation rather than only a generic deployed/healthy boolean?
4. Are provenance/verifier-root/policy/config/trust/schema/binding revisions persisted in qualification evidence?
5. Does retry logic distinguish failed actuation from ambiguous external effect and reconcile first?
6. Can rollback/provider substitution retain residual cohorts without falsely declaring closure?
7. Are Station/AGWS/AI paths structurally unable to weaken enterprise admission/trust/provider-admin authority?

## Hypotheses / disposition
- **KEEP/HARDEN** immutable artifact identity and existing provenance/retrieval verification.
- **GENERALIZE** runtime qualification into the explicit cross-capability `RuntimeAdmissionQualification` revision vector.
- **INTEGRATE** Build/Artifact → Provider/Config/Trust/Schema → Deployment observed-generation evidence without collapsing ownership.
- **PROVIDERIZE** Sigstore/Kubernetes/cloud-runtime-specific verification, rollout and observation mechanisms.
- **HARDEN** ambiguous-effect reconciliation and residual-cohort closure.
- **DO_NOT_BUILD** a second top-level “runtime admission” semantic owner or a platform-specific signature/deployment mechanism as universal architecture.

## Gate disposition
The centralized **artifact-to-runtime admission** proof junction is RESOLVED_BY_MULTI_REPRESENTATIVE_RESEARCH. This does not unblock `CAPABILITY_SYNTHESIS`: Enterprise Trust lifecycle/rotation/offline horizon, Privacy disposition, AI evaluation qualification/stale-evidence rejection, Technology Economic Governance proof suite, Domain composition/provider identity and Disconnected trust horizon remain centralized proof debt.
