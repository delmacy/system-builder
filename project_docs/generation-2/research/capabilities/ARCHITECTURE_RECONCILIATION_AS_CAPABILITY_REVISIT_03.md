# Generation 2 — Architecture Reconciliation as a Capability — Revisit 03

## Research question
How should System Builder reconcile desired, attempted, effective and observed architecture across repository, provider, topology, runtime, security and Station planes while proving evidence freshness, avoiding blind retries after ambiguous actuation, preserving explicit action-scoped authority and preventing probabilistic reconstruction or provider observation from silently becoming canonical architecture?

## Representatives and evidence
1. **Kubernetes status/conditions and observedGeneration** — controller status is generation-qualified; conditions admit `True`, `False` and `Unknown`. Pod observed-generation tracking also distinguishes direct status from effects that still reflect a previous generation. Sources: https://kubernetes.io/docs/reference/kubernetes-api/apps/deployment-v1/ and https://kubernetes.io/docs/concepts/workloads/pods/ .
2. **Flux Kustomize Controller** — exposes `lastAttemptedRevision`, `lastAppliedRevision`, `observedGeneration`, `Ready`, `Reconciling`, `Stalled`, dependency readiness and inventory. A generation can be observed while reconciliation is stalled, and attempted revision is not equivalent to applied revision. Source: https://fluxcd.io/flux/components/kustomize/kustomizations/ .
3. **Crossplane managed resources** — separates `Observe`, `Create`, `Update`, `Delete` and `LateInitialize` through `managementPolicies`; provider support varies. It records create-pending/succeeded/failed timestamps and deliberately halts when creation outcome is ambiguous to avoid leaking/duplicating external resources. Late initialization may import provider-selected values into managed desired state only when that capability is enabled. Sources: https://docs.crossplane.io/latest/managed-resources/managed-resources/ and https://docs.crossplane.io/latest/guides/import-existing-resources/ .
4. **Terraform refresh/plan lineage** — prior revisit evidence remains authoritative: observation, remembered state, configuration and mutation are distinct; refresh/plan can reveal drift without itself authorizing infrastructure change.
5. **Architecture-conformance literature** — DCL 2.0 reports that structural violations can hide/mask other violations and argues for modular/hierarchical architectural constraints; architecture-erosion mapping literature shows erosion has technical and non-technical causes; continuous-conformance studies demonstrate value in evaluating intended versus implemented architecture repeatedly rather than treating architecture as a one-time artifact. Sources: https://link.springer.com/article/10.1186/s13173-017-0061-z , DOI 10.1002/smr.2423, and https://www.jucs.org/jucs_23_8/introducing_an_architectural_conformance.html .
6. **Recent AI architecture-recovery literature** — 2026 work on recovering architecture intent from historical work items reports useful reconstructed baselines but lower stability for relationships and compounding variance across generation stages. Such recovered architecture is valuable evidence, but not canonical authority without deterministic validation and human/constitutional disposition. Source: https://arxiv.org/abs/2608.28403 .
7. **GitOps performance literature** — controlled 2025 benchmarking of Argo CD, Flux CD and ConfigSync reports differing latency/resource trade-offs under single- and multi-intent scenarios, showing that reconciliation freshness must include processing/convergence lag rather than only source observation timestamp. Source: https://arxiv.org/abs/2509.13901 .

## Primitive refinement
Architecture reconciliation now requires the following distinct identities:

`DesiredArchitectureRevision → ReconciliationIntent → ReconciliationAttempt → EffectiveRealization → ObservationSnapshot → QualifiedEvaluation → Disposition/RepairTransition → PostconditionEvidence`

No edge is inferred from another. In particular:
- observed generation does not prove readiness;
- attempted revision does not prove applied revision;
- applied revision does not prove healthy/effective semantics;
- an observation does not authorize mutation;
- a provider-selected value does not become canonical desired architecture without an explicit normalization/late-initialization authority;
- a repair request with unknown outcome cannot be blindly retried.

## Source of truth and identity
The semantic source of truth remains the revisioned ArchitectureDecision/ArchitectureObligation graph plus applicability. This revisit adds explicit identities for:
- `ObservedSubjectGeneration` — the exact subject generation/revision to which status/evidence applies;
- `ReconciliationAttempt` — candidate intent, target, action facet, provider, start/end/result and input revisions;
- `AppliedRevisionEvidence` — evidence that a candidate revision was actually materialized;
- `ActuationOutcome` — `SUCCEEDED | FAILED | UNKNOWN | PARTIAL` with provider/external identity evidence;
- `NormalizationProposal` — provider-observed/defaulted information proposed for admission into desired state;
- `ReconciliationLagEvidence` — desired-revision age, queue/attempt latency, application latency and health-convergence latency;
- `ObligationDependency` — upstream structural/classification obligations whose unresolved state can make downstream evaluations inconclusive.

## Lifecycle/versioning/failure semantics
A reconciliation attempt is not a binary success/failure operation. Minimum semantics:

`QUEUED → OBSERVING → PROPOSED → APPROVED → ACTUATING → SUCCEEDED | FAILED | PARTIAL | OUTCOME_UNKNOWN → POSTCONDITION_VERIFIED | POSTCONDITION_FAILED`

`OUTCOME_UNKNOWN` is a first-class quarantine state. Crossplane's leaked-resource protection is strong production evidence: when the controller cannot determine whether an external create succeeded, blind replay risks duplication. Recovery requires bounded external observation, identity reconciliation and an authorized decision before retry/cleanup.

Status must be generation-qualified. If `observedGeneration < desiredGeneration`, architecture posture is stale. If the generation is current but `Ready=False`, `Stalled=True`, `Unknown`, or health postconditions are incomplete, current observation still does not imply conformance.

## Authority model
Reconciliation authority is action-faceted rather than boolean:

`ObserveAuthority ≠ NormalizeDesiredStateAuthority ≠ CreateAuthority ≠ UpdateAuthority ≠ DeleteAuthority ≠ ExceptionAuthority ≠ RepairApprovalAuthority ≠ RecoveryAuthority`.

Crossplane demonstrates this mechanically with management policies. For SB this becomes constitutional and provider-neutral. A provider can advertise supported actuation facets, but capability discovery cannot grant them. Effective authority is the intersection of constitutional policy, Enterprise/Station/Role delegation, target scope, provider capability and current approval evidence.

`LateInitialize`-like behavior is especially sensitive: observation may suggest a provider-selected default, but importing it into desired architecture is a semantic mutation and requires explicit `NormalizeDesiredStateAuthority` plus provenance. Observe-only integrations must never mutate desired state.

## Evidence freshness and observability
Every evaluation should expose:
- desired architecture revision and desired generation;
- last generation observed;
- last attempted revision;
- last successfully applied/effective revision;
- current readiness/health/unknown/stalled state;
- observation source, time, interpreter revision and coverage;
- reconciliation queue/attempt/apply/health latency;
- actuation outcome including `UNKNOWN`/`PARTIAL`;
- active authority envelope and provider capability facets;
- unresolved upstream obligations that may mask downstream findings;
- postcondition evidence and its freshness.

Reconciliation SLOs should therefore be expressed over convergence lag, not merely polling frequency. A fresh observation of a stale desired revision, or a current observed generation that is stalled, is not equivalent to timely convergence.

## Extensibility/provider boundaries
Providers implement observation and optionally actuation facets behind a provider-neutral contract. Replacement must preserve semantic desired identity, subject identity, attempt lineage, action-facet semantics, outcome vocabulary, generation qualification and postcondition evidence.

Provider-specific conveniences such as Crossplane late initialization or Flux inventory must be mapped to universal primitives; they may enrich realization but may not own canonical architecture semantics.

## Convergent patterns
- desired, attempted, applied/effective and observed revisions are distinct;
- status is meaningful only when bound to the subject generation it observed;
- reconciliation can be progressing, stalled, failed or unknown independently of generation currency;
- actuation capabilities are separable (`observe/create/update/delete/normalize`), not one reconciliation permission;
- ambiguous external outcomes require quarantine/reconciliation before retry;
- architectural obligations benefit from modular/hierarchical dependency structure;
- architecture-recovery AI is evidence/proposal, not architecture authority;
- reconciliation freshness includes convergence lag and health postconditions.

## Divergent patterns
- Flux is intentionally active GitOps and may continuously re-apply desired state; SB must retain explicit authority gates where the target action is privileged or canonical.
- Crossplane can late-initialize desired resource fields from provider observation; SB treats this as an explicitly governed normalization transition, not a default universal behavior.
- Kubernetes condition/status models expose current observations but do not by themselves define enterprise architecture semantics.
- static architecture-conformance research focuses heavily on code structure; SB reconciliation spans code, definition, topology, provider, runtime, security and Station planes.

## Hypotheses
- **KEEP** revisioned ADR/repository-memory authority and deterministic conformance checks.
- **HARDEN** every architecture evaluation with generation/revision qualification, convergence-lag evidence, explicit unknown/partial outcomes and postcondition verification.
- **GENERALIZE** reconciliation into desired→attempted→effective→observed lineage across all planes.
- **PROVIDERIZE** observation and action facets separately; capability negotiation must report provider support without granting authority.
- **INTEGRATE** reconciliation attempts with shared governed transitions, unified evidence qualification, recovery and incident invalidation.
- **REPLACE** boolean `sync/compliant` assumptions with explicit generation, attempt, applied/effective, health and evidence states.
- **DEFER** autonomous repair where action-specific authority, rollback and ambiguous-outcome recovery are not proven.
- **DO_NOT_BUILD** an AI or controller path that can infer canonical architecture or privileged repair authority from discovered drift/provider defaults alone.

## Repo-validation questions
1. Which existing SB checks/statuses bind their result to the exact repository/definition/runtime generation they observed?
2. Can existing CI/reconciler evidence distinguish attempted revision from actually applied/effective revision?
3. Are any product paths able to mutate desired state from provider/runtime observation without a separately represented normalization authority?
4. Where can an external side effect succeed while SB loses the acknowledgement, and how are duplicate/leaked-resource retries prevented?
5. Can provider capability negotiation represent Observe/Create/Update/Delete/Normalize independently from actual delegated authority?
6. Which architecture checks depend on upstream classification/model extraction whose failure should make downstream results `INCONCLUSIVE` rather than `PASS`?
7. Can reconciliation lag/queue age be measured independently from evidence observation time?
8. Are AI-derived architecture summaries/proposals distinguishable from canonical ADR/obligation revisions and deterministically validated before promotion?
9. Does offline/local reconciliation closure contain enough subject generation, obligation, interpreter, trust and attempt history to diagnose `OUTCOME_UNKNOWN` safely?
10. Can cross-Station reconciliation aggregate evidence without granting a parent/peer Station repair authority over another Station?

## Symbiotic Proof
Architecture Reconciliation is proven symbiotic when one semantic obligation is observed by at least two heterogeneous providers/planes and the system can distinguish current desired generation, last observed generation, last attempted revision, effective/applied revision, readiness/postcondition and action-specific authority. An observe-only provider must never mutate canonical desired state. An injected acknowledgement loss after a real external create must produce `OUTCOME_UNKNOWN` and prevent blind duplicate actuation until external identity is reconciled. Replacing the provider must preserve semantic obligation and attempt/evidence lineage.

## Stable findings
- **G2-FINDING-ARAC-23 — Architecture Status Must Be Generation-Qualified; Current-Looking Status Bound to an Older Subject Generation Is Stale Evidence.**
- **G2-FINDING-ARAC-24 — Attempted Revision, Applied/Effective Revision and Ready/Healthy Postcondition Are Distinct Reconciliation Facts.**
- **G2-FINDING-ARAC-25 — Reconciliation Authority Is Action-Faceted; Observe, Normalize, Create, Update and Delete Capabilities Must Not Collapse Into One Permission.**
- **G2-FINDING-ARAC-26 — Ambiguous Actuation Outcome Is a First-Class Quarantine State; Blind Retry Can Duplicate or Leak External Realizations.**
- **G2-FINDING-ARAC-27 — Provider Observation May Enter Desired State Only Through an Explicitly Authorized, Provenanced Normalization/Late-Initialization Transition.**
- **G2-FINDING-ARAC-28 — Reconciliation Freshness Includes Queue, Attempt, Apply and Health-Convergence Lag, Not Observation Timestamp Alone.**
- **G2-FINDING-ARAC-29 — Obligation Dependencies and Structural Extraction Failures Can Mask Downstream Violations and Must Propagate INCONCLUSIVE/Coverage Semantics.**
- **G2-FINDING-ARAC-30 — AI-Recovered Architecture Is Qualified Evidence/Proposal, Not Canonical Architecture Authority; Relationship Uncertainty Must Remain Explicit.**

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-GENERATION-QUALIFIED-RECONCILIATION-EVIDENCE` — **CROSS_CUTTING / MERGE_TARGET**. Merge into unified evidence qualification/revision-bound realization lineage if synthesis confirms generation is a general subject-revision dimension.
- `G2-CAPABILITY-CANDIDATE-FACETED-RECONCILIATION-ACTUATION-AUTHORITY` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with non-actuating authority separation and Provider/Binding capability negotiation.
- `G2-CAPABILITY-CANDIDATE-AMBIGUOUS-ACTUATION-OUTCOME-QUARANTINE` — **CROSS_CUTTING / CANDIDATE**. Workflow, Integration, Deployment and Recovery should confirm shared `UNKNOWN/PARTIAL` side-effect semantics before promotion.
- `G2-CAPABILITY-CANDIDATE-AUTHORIZED-OBSERVATION-TO-DESIRED-NORMALIZATION` — **CROSS_CUTTING / CANDIDATE**. Promote only if provider defaults/import/adoption across Data, Config, Deployment and brownfield flows require one reusable normalization contract.
- `G2-CAPABILITY-CANDIDATE-RECONCILIATION-CONVERGENCE-LAG-EVIDENCE` — **CROSS_CUTTING / MERGE_TARGET**. Expected to merge into unified evidence qualification/observability freshness semantics unless synthesis finds separate ownership.

No candidate is promoted in this revisit. Adaptive Governed Work Surfaces remains explicitly distinct and unchanged.

## Value / risk / priority / next question
**Value:** closes a major enterprise correctness gap between detecting drift and proving safe convergence under asynchronous controllers/providers.

**Risk reduced:** stale-success interpretation, duplicate external side effects, accidental provider-default canonization, authority amplification, false conformance after masked structural failures and AI-generated architecture becoming de facto authority.

**Priority:** HIGH / constitutional cross-cutting.

**Next question:** once cycle 4 closes, cycle 5 should start at the oldest non-saturated capability and test whether the growing unified lineage/evidence/authority primitives now reduce new findings or expose deeper conflicts under research-by-exception.
