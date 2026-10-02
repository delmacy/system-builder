# G4 — Bounded Trust-Fork Reconciliation for Proprietary Editors

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23

## Scope

Continuation of `G4_EDITOR_TRUST_ROLLOVER_PROOF_LONGEVITY_RESEARCH.md` and `G4_EDITOR_CANONICALIZATION_LONG_TERM_PROOF_RESEARCH.md`. This round studies bounded reconciliation when Factory, Client and autonomous/offline runtimes have observed divergent trust-set revisions. It remains P&D documentation only: no implementation, provider selection, WBS, Work Package, Sprint or TASK is authorized.

Current product-interface program remains `Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`. 3D is optional and never required for trust operations.

## External pattern evidence reviewed

- The Update Framework (TUF) treats trusted root metadata as a versioned chain and is designed against rollback/freeze-style attacks. Sigstore applies a TUF-governed root with offline/threshold root keys, rotation, compromise-time-aware revocation and freshness checks against stale trust metadata.
- Sigstore also documents air-gapped trust-root operation: when a mirror is unavailable, roots can be supplied out-of-band, but rotation becomes an explicit/manual lifecycle concern. This is directly relevant to autonomous runtimes that cannot depend on Factory availability.
- Certificate Transparency demonstrates a useful separation between locally valid signed views and globally reconciled consistency. Merkle consistency proofs can establish append-only relation between tree heads; conflicting signed tree heads are evidence of equivocation. Gossip/auditing is a detection/reconciliation mechanism, not a source of business authority.
- NIST SP 800-57 treats trust anchors, compromise, recovery and key lifecycle as explicit key-management concerns. Trust-anchor possession is not itself a universal policy for resolving divergent administrative histories.

These are pattern evidence only. No TUF, Sigstore, CT, quorum system or cryptographic provider is selected.

## F129 — Reconciliation authority is scoped; Factory is not automatically an online root oracle

Published runtimes must remain autonomous. Therefore trust reconciliation cannot require a permanently reachable Factory to answer every admission decision. Instead, a trust domain needs a durable, locally evaluable `ReconciliationAuthorityPolicy` that names who may reconcile which class of divergence and under what evidence.

```text
ReconciliationAuthorityPolicy
  trustDomainId
  policyRevision
  authoritySubjects[]
  authorityThreshold?
  permittedForkClasses[]
  protectedScopes[]
  admissibilityFloors[]
  offlineValidityHorizon?
  emergencyProcedureRef?
  qualificationEvidenceRefs[]
```

`Factory coordinates != Factory is mandatory runtime authority`.

Factory may author/distribute a policy; a Client may own a trust domain; a runtime may locally enforce already-qualified policy. Ownership must be explicit rather than inferred from topology.

## F130 — Trust forks need causal ancestry, not latest-version arbitration

A fork is reconcilable only after establishing the relation of its trust revisions: ancestor/descendant, concurrent siblings, or unknown ancestry.

```text
TrustForkGraph
  commonAncestorRef?
  branchHeads[]
  predecessorEdges[]
  observedTrustFloors[]
  admittedProofRanges[]
  effectOccurrenceRanges[]
  revocation/compromiseClaims[]
  ancestryDisposition = PROVEN | PARTIAL | CONFLICTING | UNKNOWN
```

Version number and wall clock are supporting metadata, never authority.

`higher version != authoritative winner`.

A branch whose ancestry cannot be proven remains quarantined/UNKNOWN for affected new admissions according to policy; historical occurrences are retained as facts.

## F131 — Reconciliation has separate semantic, security and effect dimensions

A single `MERGED` state is unsafe. Candidate vector:

```text
TrustForkReconciliation
  ancestryDisposition
  securityDisposition
  verifierDisposition
  proofAdmissionDisposition
  historicalInterpretationDisposition
  continuationDisposition
  newEffectDisposition
  irreversibleEffectDisposition
  remediationDisposition
```

Two branches may be semantically compatible yet differ in security admissibility. Conversely, trust metadata may reconcile while irreversible effects admitted by both partitions remain materially divergent.

`trust metadata reconciled != effects reconciled`.

This preserves the existing distinction between historical interpretation, continuation authority and new-effect admissibility.

## F132 — Safe automatic reconciliation is limited to monotonic/compatible cases

Automatic convergence is a candidate only where evidence proves that one branch is an admissible extension of another or both changes commute under the protected invariant.

Candidate classes:

- `ANCESTOR_ADVANCE`: B is a qualified successor of A and does not violate an observed floor;
- `COMPATIBLE_OVERLAP`: branches differ only within an explicitly authorized rollover overlap;
- `DISJOINT_SCOPE`: changes protect independent named scopes and composition is proven compatible;
- `CONFLICTING_AUTHORITY`: branches grant/revoke overlapping authority incompatibly;
- `COMPROMISE_CONFLICT`: one branch reports compromise/revocation material to the other;
- `UNKNOWN_ANCESTRY` / `UNKNOWN_COMPATIBILITY`.

Only the first three are candidates for bounded automatic reconciliation. The rest require explicit qualified resolution/quarantine.

`mergeable bytes != mergeable authority`.

## F133 — Quorum is evidence under a named governance rule, not majority truth

A threshold can reduce single-key compromise risk, as demonstrated by threshold-root patterns such as Sigstore's root governance, but `2-of-3 says branch A` is meaningful only if the policy already authorizes those signers, their independence/currentness assumptions hold and the fork class is within their scope.

Candidate:

```text
ReconciliationAttestation
  forkRef
  policyRevisionRef
  authoritySubjects[]
  thresholdSatisfied
  independenceAssumptionRef?
  reviewedBranchHeads[]
  decision
  decisionScope
  issuedAt
```

`quorum satisfied != semantic correctness`.

A quorum cannot retroactively erase an external effect, bypass a higher observed security floor, or grant authority outside its policy scope.

## F134 — Anti-rollback floors constrain reconciliation outcomes monotonically

Each participant can possess a durable `ObservedTrustFloor`. Reconciliation must compute a floor compatible with all qualified non-revoked observations relevant to the scope; it cannot select a branch that requires a participant to forget a stronger security floor merely to restore availability.

Where floors are genuinely incompatible and no qualified successor bridges them, disposition is `QUARANTINED/REQUIRES_REMEDIATION`, not forced convergence.

`availability restoration != security-floor rollback`.

Snapshot restore, cache eviction or reconnect cannot lower the floor.

## F135 — Branch-local admissions survive as historical facts with interval lineage

During a partition, each side may have admitted proofs/effects under the trust revision it locally considered admissible. Reconciliation must preserve those intervals:

```text
BranchAdmissionInterval
  branchRef
  trustRevisionRef
  verifierRevisionRefs[]
  fromObservation
  toObservation?
  admittedProofSetRef
  effectOccurrenceSetRef
  laterDisposition
```

If branch B later learns that an anchor was compromised at time T, affected admissions can be classified prospectively/retrospectively according to explicit policy. They are never deleted from history because the other branch won reconciliation.

`rejected after reconciliation != never occurred`.

## F136 — Effect authority requires a stricter reconciliation path than read-only verification

A runtime can often continue historical verification/read-only interpretation under stale but locally qualified trust while new external effects must stop sooner. The reconciliation policy therefore needs operation-class gates:

`HISTORICAL_VERIFY`, `READ`, `SIMULATE`, `AUTHORIZE`, `PUBLISH`, `NEW_EFFECT`, `COMPENSATE`, `RECONCILE_EFFECT`.

This maps naturally to editor states: a Workflow or Component remains editable/readable while publish or authorized actions are `BLOCKED/UNKNOWN`.

`trust stale != editor unusable` and `editable != publish admissible`.

## F137 — Cross-domain trust bridges must not manufacture transitive reconciliation

Factory, Client and runtime domains may have different trust roots and bridge revisions. Reconciling Client branch A/B does not automatically reconcile a Factory↔Client bridge or a runtime-local trust floor.

A `TrustBridgeQualification` is itself a versioned dependency in the reconciliation graph. Bridge change can therefore make a locally reconciled branch inadmissible to another domain until that bridge is requalified.

`domain-local reconciliation != federation-wide reconciliation`.

## F138 — Offline reconciliation packages should be proof-carrying and bounded

Air-gapped/manual operation motivates a portable candidate artifact:

```text
TrustReconciliationPackage
  forkIdentity
  includedBranchHeads[]
  ancestryEvidenceRefs[]
  trustPolicyRevisionRefs[]
  floorEvidenceRefs[]
  revocation/compromiseEvidenceRefs[]
  reconciliationDecisionRef
  signatures/attestations[]
  validity/currentnessConstraints
  targetScope
```

The package is evidence for a decision, not a mutable global truth blob. A runtime verifies it locally against its durable floor and policy. A package below the local floor or outside its scope is rejected/UNKNOWN rather than blindly imported.

This preserves autonomous runtime operation without turning USB/file transfer or Factory export into implicit authority.

## F139 — Transparency/gossip can expose fork evidence but cannot choose the winner

Certificate Transparency is a strong analogue for detecting conflicting signed views: consistency proofs can relate append-only heads, while conflicting signed heads provide evidence of misbehavior. For G4, witness/transparency mechanisms may help establish that divergent trust heads existed and when they were observed.

They do not decide which branch is semantically/administratively authorized.

`fork detected != fork resolved`.

This distinction belongs visibly in Evidence and Revision/Diff.

## F140 — Shared Editor Foundation needs a bounded Trust Fork Review projection

The shared infrastructure should project, not own:

- common ancestor and branch heads;
- changed anchors/policies/algorithm profiles;
- observed floors per participant/domain;
- admitted proof/effect intervals;
- revocation/compromise conflicts;
- reconciliation authority/quorum basis;
- proposed outcome by operation class;
- historical facts that remain after resolution;
- affected PublishBundles/evidence/findings;
- unresolved/UNKNOWN dimensions.

The default UX should be guided: incompatible outcomes are filtered/disabled with an explanation; missing prerequisite evidence is surfaced before authorization; critical minority conflicts cannot be hidden by aggregate summaries.

All reconciliation actions require keyboard/list/tree/Inspector equivalents. Spatial/drag affordances may visualize branches but are never required.

## F141 — Preview/Sandbox can rehearse reconciliation but cannot satisfy effective trust

Preview may load two trust branches and simulate candidate policies to answer questions such as “which bundles become blocked?” or “which effects require review?”. Its evidence must pin the fork graph, policy revision and substitutions.

`reconciliation simulation != authorized reconciliation`.

Preview mismatch against effective runtime trust becomes a finding/evidence-currentness issue rather than silently updating production state.

## F142 — Revision/Diff requires a Trust Fork Diff distinct from artifact diff

Candidate facets:

`ANCESTRY`, `ANCHOR/POLICY`, `SECURITY FLOOR`, `ADMISSION INTERVAL`, `EFFECT IMPACT`, `AUTHORITY/QUORUM`, `REMEDIATION`, `CURRENTNESS`.

This permits a visually tiny trust-root change to expose a large semantic blast radius without confusing it with Workflow/Form/Component source changes.

## Semantic bridge findings

The cross-app chain remains typed:

```text
Workflow/View/Form/Component/Rule revision
 -> Command/Action intent
 -> Permission/Policy authority
 -> PublishBundle qualification
 -> verifier + TrustSetRevision/TrustBridgeQualification
 -> ProofEnvelope / Preview evidence
 -> runtime EffectOccurrence
 -> branch-local admission/effect interval
 -> TrustFork reconciliation evidence
 -> Evidence currentness + Revision/Diff projection
```

Ownership remains separate. A UI control does not become authority; a Component event does not become an authorized action; a visual branch merge does not become a trust/security merge; a Workflow transition does not prove an effect.

## Required/adversarial scenarios

1. Factory sees R12, offline Client sees R10 and runtime has durable floor R11: reconnect cannot force runtime to R10.
2. Partition A adds anchor X while partition B revokes predecessor Y for compromise: unioning anchors would silently weaken security; require reconciliation.
3. A and B rotate independent disjoint trust scopes with qualified composition: bounded automatic reconciliation may be admissible.
4. Branch B has numerically newer revision but ancestry proof is missing: no latest-wins.
5. Threshold signers approve a reconciliation outside their policy scope: quorum does not grant authority.
6. Two valid threshold groups sign conflicting branch outcomes: create governance conflict/UNKNOWN; do not count signatures globally.
7. Client returns from air gap with a proof-carrying reconciliation package below its observed floor: reject/quarantine locally.
8. Trust metadata reconciles but both partitions caused irreversible external effects: preserve both effect lineages and remediate separately.
9. Historical proof accepted before compromise remains interpretable while new effect admission is blocked under current policy.
10. A trust bridge changed while Client branches were offline: local reconciliation does not imply Factory acceptance.
11. Missing transparency witness data: absence does not prove no fork; disposition remains bounded by available evidence.
12. Preview says candidate branch is compatible but effective runtime has a stronger local floor: production remains blocked/unknown.
13. Schema/canonicalization migration occurs on one trust branch: byte compatibility cannot substitute for semantic bridge evidence.
14. Reconciliation decision is later superseded by compromise evidence: historical decision remains recorded; current admissibility is re-evaluated.
15. Drag/drop visualization is inaccessible: equivalent branch comparison, decision review and authorization remain possible by keyboard/list/Inspector.
16. 100k proofs depend on a revoked branch: aggregate by root cause/affected set while preserving minority-critical and UNKNOWN claims.

## Reusable primitives / editor integration

### Shared primitive

`TrustForkRef`, `BranchHeadRef`, `ReconciliationAuthorityPolicyRef`, `ObservedTrustFloorRef`, `BranchAdmissionIntervalRef`, `ReconciliationAttestationRef`, reconciliation vector/disposition badges.

### Editor infrastructure

- Trust Fork Review projection;
- ancestry/floor/authority inspector;
- affected-set/root-cause findings;
- operation-scoped admission matrix;
- proof-carrying reconciliation package viewer;
- non-spatial/keyboard review and authorization flow;
- impact-graph edges for branch/floor/bridge dependencies.

### Proprietary apps

- Workflow Designer: shows which workflow proofs/effects are affected; does not own reconciliation.
- Componentes: reuses operation-scoped trust states (`STALE`, `BLOCKED`, `UNKNOWN`, `PERMISSION_DENIED`) and evidence refs.
- View/Page/Form: remain editable when trust blocks only publish/effect operations; binding findings stay separate from trust findings.
- Rules/Decision: can express policy candidates but cannot self-authorize a trust fork resolution.
- System/Module Designer: declares trust-domain/bridge topology requirements without treating topology as authority.
- Elicitation/Requirements: may propose remediation and capture rationale; cannot activate trust state.
- Preview/Sandbox: rehearses candidate reconciliation against pinned evidence.
- Revision/Diff: primary projection for trust-fork lineage and impact, not owner of trust.

### Cross-app semantic integration

P3 remains the hotspot: independently versioned artifact, permission, verifier, trust, bridge, retention, environment and effect histories must be reconciled without a synthetic global revision or mandatory online Factory.

## Componentization / dependency complexity

- **P0 LOW/MEDIUM:** fork/head/floor refs, dispositions, operation-class status.
- **P1 MEDIUM/HIGH:** Trust Fork Review, ancestry browser, admission matrix, findings aggregation, package viewer.
- **P2 HIGH/VERY HIGH:** app-specific impact adapters and Preview/Revision projections.
- **P3 EXTREME:** authority/quorum qualification, anti-rollback floors, bridge-scoped federation, branch-local effect lineage, retrospective compromise and offline proof-carrying reconciliation.

State-explosion hotspot: `branch × trust revision × verifier revision × bridge revision × operation class × environment × observed floor × effect disposition`. The UI must query/project this state, not encode it as component variants.

## Proof obligations

1. Reconciliation never selects a branch solely by version/timestamp.
2. No reconciliation outcome lowers a qualified observed security floor without an explicitly authorized stronger transition rule.
3. Factory unavailability does not prevent runtime-local verification of already-qualified reconciliation policy/evidence within its horizon.
4. Automatic reconciliation occurs only for proven ancestor/compatible/disjoint-scope cases.
5. Quorum is evaluated under the exact policy revision/scope and never treated as semantic majority truth.
6. Historical branch-local admissions/effects remain auditable after reconciliation.
7. Trust metadata reconciliation never erases or manufactures external effect settlement.
8. Cross-domain bridge acceptance is requalified independently; trust does not become transitive through merge.
9. Offline reconciliation packages are locally verified against floor/currentness/scope before use.
10. Transparency/witness evidence may prove divergence/consistency but cannot choose business authority.
11. Preview results cannot mutate effective trust or satisfy production reconciliation implicitly.
12. Every trust-fork action has keyboard/non-drag equivalent and preserves semantic focus.
13. Findings aggregation preserves blocking/UNKNOWN minority truth.
14. Incremental impact of reconciliation is equivalent to full qualification for the affected proof fixture or degrades to UNKNOWN/full requalification.

## Research maturity / saturation

`EDITOR_BOUNDED_TRUST_FORK_RECONCILIATION = ADVANCED_EMERGING / MATERIAL_DELTA`.

High-confidence conclusions:

- trust-fork reconciliation is authority- and invariant-scoped, not latest-wins;
- Factory can coordinate trust governance without becoming a mandatory online runtime dependency;
- ancestry, security, admission, continuation, new-effect and irreversible-effect dispositions remain independent;
- automatic convergence is safe only for qualified monotonic/compatible cases;
- quorum proves a governance condition, not semantic truth;
- observed floors constrain recovery monotonically;
- branch-local admissions/effects survive reconciliation as historical facts;
- offline reconciliation should be proof-carrying and locally verifiable;
- transparency/gossip detects divergence but does not resolve authority;
- the Shared Editor Foundation can provide one Trust Fork Review projection across proprietary apps without collapsing ownership.

Remaining material gaps:

1. precise governance model for emergency recovery when every currently authorized reconciliation authority is unavailable/compromised;
2. bounded recovery from mutually incompatible observed floors without a hidden global super-root;
3. privacy/retention policy for branch admission intervals and fork evidence;
4. empirical scale budgets for fork-impact propagation across `10^3–10^6` proofs/effects;
5. UX studies for high-stakes reconciliation review and dual-control authorization without alert fatigue.

Next vector: emergency trust-governance recovery and break-glass authority without creating an immortal super-root, then privacy-safe retention/currentness of trust-fork evidence. Research remains non-executable.