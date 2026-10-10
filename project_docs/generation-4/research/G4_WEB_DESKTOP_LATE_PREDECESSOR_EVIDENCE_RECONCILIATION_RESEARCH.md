# G4 Web Desktop — Late Predecessor Evidence Reconciliation After Catastrophic Rebootstrap

Date: 2026-09-23
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: documentary P&D only. No WBS, Work Package, Sprint, TASK, provider adoption or product implementation authority.

## 1. Research question

This round follows `G4_WEB_DESKTOP_RETIREMENT_FENCE_CATASTROPHIC_REBOOTSTRAP_RESEARCH.md`.

The prior round established that catastrophic rebootstrap may legitimately create a new recovery-authority epoch while recording `CONTINUITY_GAP_DECLARED` when no surviving anchor can prove uninterrupted continuity. The unresolved case is temporal: months after the new epoch has produced real operation and external effects, predecessor evidence may reappear — an HSM package, witness receipt, retirement fence, revocation record, immutable provider metadata or offline medium — and prove a predecessor security/authority floor stronger than the one assumed during rebootstrap.

The architecture must absorb that evidence without pretending time ran backwards, deleting post-bootstrap facts, or silently validating effects that were never admissible under the newly discovered predecessor floor.

Core distinction:

`Late predecessor evidence != rollback command`.

And:

`Evidence changes what can be proven about an occurrence != evidence erases the occurrence`.

## 2. Consumed repository evidence and deduplication

This study preserves the repository constitutional rules: `Builder != Runtime`, autonomous published runtimes, replaceable suite modules, explicit contracts, anti-lock-in and repository-as-memory.

It deduplicates the established Web Desktop/recovery line:

- `Recovery material possession != current recovery authority`;
- `No current fence available != proof that no retirement fence exists`;
- catastrophic rebootstrap creates a new authority epoch and records continuity disposition rather than fabricating predecessor continuity;
- `Data recovered != effect authority recovered`;
- negative/fencing evidence must outlive resurrection paths or be subsumed by a stronger durable fence;
- `UNKNOWN` is an evidence disposition, never permission to guess;
- historical verification, continuation authority and new-effect admissibility are independent;
- external effects remain historical facts even when later evidence proves they were unsafe, unauthorized or semantically inadmissible.

The latest Palantir benchmark outputs add a compatible boundary: model proposal, human approval, effective execution principal and observed effect are separate; deterministic/pinned input provenance has a currentness scope. These findings reinforce the need to preserve occurrence/effect provenance rather than retroactively rewrite it, but they do not alter Station implementation sequencing.

## 3. External evidence and contradictory lessons

### 3.1 RFC 5280 — invalidity can predate revocation processing

X.509 CRLs distinguish `revocationDate` from the optional `invalidityDate`. `invalidityDate` can represent the earlier time at which a private key is known or suspected to have been compromised, even when the revocation is processed and distributed later.

Transferable lesson:

`Evidence observation time != evidence effective/claimed invalidity time`.

Late evidence can legitimately change the security interpretation of earlier occurrences. It does not make those occurrences disappear.

### 3.2 Sigstore — compromise-time evidence preserves a temporal boundary

Sigstore's threat model explicitly supports marking compromised material with an indication of compromise time so legitimate signatures from before compromise can remain verifiable. Its transparency model also separates evidence that an artifact/signature existed at a prior time from policy about whether the identity should have been trusted.

Transferable lesson:

`Historically authentic != currently admissible`, and `late compromise evidence != all historical evidence invalid`.

The architecture needs temporal qualification, not blanket retroactive invalidation.

### 3.3 Transparency evidence — late discovery can strengthen history without rewriting it

Sigstore/Rekor-style inclusion/timestamp material can provide durable evidence that an event existed before a time. Such evidence may arrive after an operational decision and improve the historical proof set.

Transferable lesson:

`Late evidence may refine historical disposition while occurrence identity remains immutable`.

### 3.4 Incident response — recovery is followed by continuing analysis/remediation

NIST SP 800-61 Rev. 3 frames incident response as integrated risk management across detection, response and recovery. Recovery is not a semantic declaration that all uncertainty has ended; later findings can require additional mitigation.

Transferable lesson:

`Service restored != incident knowledge closed`.

## 4. Material finding — temporal reconciliation, not temporal rollback

A catastrophic bootstrap at epoch `E2` may be valid under the evidence available at bootstrap time even if later predecessor evidence proves that some assumption about `E1` was incomplete.

Therefore the model needs at least three times/scopes:

1. **occurrence/effect time** — when an action/effect actually happened;
2. **evidence claim/effective time** — the time interval to which the late evidence applies (for example compromise or retirement floor);
3. **observation/reconciliation time** — when the new epoch learned and qualified the evidence.

These MUST NOT be collapsed into one timestamp.

Core invariants:

`Observed later != effective later`.

`Effective earlier != occurrence erased`.

`Post-bootstrap effect fact != post-bootstrap effect admissibility`.

`New predecessor floor discovered != automatic rollback to predecessor authority`.

The current authority epoch remains current unless a separately authorized transition changes it. Late predecessor evidence constrains interpretation, remediation and future admission; it does not resurrect the predecessor epoch as active authority.

## 5. Candidate semantic model

### 5.1 LatePredecessorEvidenceOccurrence

```text
LatePredecessorEvidenceOccurrence
  clientRef
  evidenceOccurrenceId
  predecessorAuthorityEpoch
  currentAuthorityEpoch
  evidenceClass
  evidenceIdentity
  evidenceProvenance
  authenticityDisposition
  claimedEffectiveInterval
  observedAt
  predecessorFloorClaim
  affectedScope
  continuityImpact
  affectedOccurrenceSetRef
  affectedCredentialSetRef
  affectedDeploymentSetRef
  affectedExternalEffectSetRef
  remediationDisposition
  gcImpact
  unknowns
```

This object records qualified evidence and its impact. It is not itself authority to mutate affected resources.

### 5.2 Reconciliation dispositions

Candidate dispositions:

- `NO_NEW_INFORMATION`
- `HISTORICAL_PROOF_STRENGTHENED`
- `CONTINUITY_GAP_NARROWED`
- `CONTINUITY_GAP_WIDENED`
- `PREDECESSOR_FLOOR_RAISED`
- `PREDECESSOR_COMPROMISE_BOUND_ESTABLISHED`
- `POST_BOOTSTRAP_REMEDIATION_REQUIRED`
- `CONFLICTING_PREDECESSOR_EVIDENCE`
- `EVIDENCE_AUTHENTIC_BUT_SCOPE_UNKNOWN`
- `QUARANTINED`
- `UNKNOWN`

A continuity gap can narrow if late evidence proves safe continuity for a bounded interval/scope. It can widen if the evidence establishes a stronger retirement, compromise or authority floor. Neither result rewrites the bootstrap occurrence.

## 6. Reconciliation state machine

```text
LATE_EVIDENCE_DISCOVERED
  -> IDENTITY_QUALIFYING
  -> AUTHENTICITY_QUALIFYING
  -> PREDECESSOR_LINEAGE_RESOLVING
  -> EFFECTIVE_INTERVAL_QUALIFYING
  -> SCOPE_QUALIFYING
  -> FLOOR_COMPARING
  -> CURRENT_EPOCH_IMPACT_EVALUATING
  -> AFFECTED_OCCURRENCES_DISCOVERING
  -> AFFECTED_CREDENTIALS/DEPLOYMENTS/EFFECTS_CLASSIFYING
     -> NO_MATERIAL_IMPACT
     -> HISTORICAL_DISPOSITION_REFINED
     -> REMEDIATION_REQUIRED
     -> CONFLICTING_EVIDENCE
     -> UNKNOWN
  -> REMEDIATION_ADMISSION_QUALIFYING
  -> REMEDIATION_EFFECT_OBSERVING
  -> POST_REMEDIATION_VERIFYING
  -> GC_REEVALUATING
```

Critical rule:

`Evidence reconciliation != remediation execution`.

Discovery may prove that remediation is required, but credential rotation, deployment replacement, external compensation or provider revocation still require their normal authority/admission paths.

## 7. Effect and authority consequences

### 7.1 Credentials and sessions

If late evidence proves a predecessor credential/root compromise interval that overlaps credentials derived or restored during bootstrap, affected current credentials become remediation candidates. The safe response is normally reissuance/rotation under the current epoch, not resurrection of predecessor credentials.

`Predecessor compromise discovered != current epoch invalid by definition`.

The current epoch is affected only through demonstrated dependency/derivation lineage.

### 7.2 Deployments and artifacts

If a deployment was admitted after bootstrap using an artifact whose trust proof depended on newly disqualified predecessor material, the deployment occurrence remains a fact. Its current admissibility can become `REQUALIFICATION_REQUIRED`, `QUARANTINED` or `REPLACEMENT_REQUIRED` according to the actual dependency.

`Deployment happened != deployment remains admissible`.

### 7.3 External effects

Irreversible effects are never erased from history. If newly discovered evidence proves the actor/credential/effect authority was invalid for the effect, the effect becomes a remediation/compensation obligation with preserved provenance.

`Unauthorized effect discovered late != effect did not occur`.

### 7.4 Current authority epoch

Late predecessor evidence cannot silently demote the current epoch or reactivate the predecessor. If it proves the bootstrap ceremony itself depended on compromised material, that is a new current-epoch security incident requiring explicit authority re-establishment, not a rollback.

## 8. GC and compaction impact

Late evidence directly constrains bounded GC.

A proof node previously classified as GC-admissible may become relevant again if newly discovered predecessor evidence introduces a live historical, security, remediation or audit question. Therefore GC safety claims need a declared evidence/coverage frontier and remain historically attributable to the evidence available when the claim was made.

Core rules:

`GC was admissible under bounded evidence != proof that no later evidence can exist`.

`Late evidence != impossible resurrection of already destroyed bytes`.

If GC already occurred legitimately, the system records `EVIDENCE_GAP` or `MATERIAL_UNAVAILABLE` where the late question can no longer be answered; it must not fabricate predecessor material.

If GC has not yet executed, discovery of material evidence invalidates/requalifies the pending GC intent before destructive effect.

## 9. Web Desktop implications

No structural change is required to:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

### Desktop Sphere taxonomy

Recovery/Security/Operations remains a functional sphere, not a runtime/deployment boundary. 3D remains an optional projection/application.

### Observatory vs Pinned Monitoring Surface vs Operations Desktop

- **Desktop Observatory:** read-oriented projection of late-evidence arrival, affected scope, continuity impact, remediation backlog and confidence/currentness.
- **Pinned Monitoring Surface:** compact warnings such as `LATE PREDECESSOR FLOOR DISCOVERED`, `CREDENTIAL ROTATION REQUIRED`, `CONTINUITY GAP WIDENED`; no authority-changing controls.
- **Operations Desktop:** qualified investigation/reconciliation/remediation surfaces.

`Late-evidence warning != remediation authority`.

### Window Manager / multi-display / session restore

Window remains an interaction session. Evidence and remediation state are durable outside window lifetime. A restored/stale window must requalify current evidence revision before any consequential command. A secondary display may show historical state but cannot preserve stale remediation admission.

Accessibility/small-screen equivalence requires textual/table representations of predecessor epoch, current epoch, effective interval, affected scope, confidence, conflicts and remediation state; timeline/graph visualization is optional.

## 10. Application Portfolio Matrix delta

No universal integration mode is selected.

| Capability/task | Preferred modes | Boundary |
|---|---|---|
| Late-evidence registry/lineage | Native SB | semantic identity, epochs, dispositions and affected-scope linkage are SB-owned |
| HSM/KMS predecessor evidence | API-backed / Hybrid / Deep-link / Native bridge | provider/hardware semantics differ; preserve raw provenance and unsupported states |
| Transparency/log verification | Native SB / API-backed / Hybrid | local proof verification where portable; provider APIs for current/export evidence |
| PKI/CRL/OCSP evidence | API-backed / Hybrid / Deep-link | mature PKI semantics reused; observation time and invalidity/effective time remain distinct |
| Offline media/witness import | Hybrid / Native bridge | local media may require host access; import never self-authorizes |
| Credential/session remediation | Native semantic orchestration + API-backed provider execution | current-epoch rotation is separate from predecessor evidence discovery |
| Deployment requalification | Native SB + Hybrid/Deep-link | SB owns semantic admissibility; mature provider tooling remains reusable |
| External-effect reconciliation | Native semantic model + Hybrid/Deep-link | effects remain provider/domain-specific facts; adapters cannot fabricate compensation equivalence |
| Historical forensic inspection | Deep-link / Embedded-qualified / Hybrid | reuse mature specialist tooling; embedding requires isolation/capability qualification |

### Matrix criteria added/refined

- evidence observation time vs claimed effective interval;
- predecessor/current epoch separation;
- lineage/dependency fidelity;
- historical authenticity vs current admissibility;
- late revocation/compromise semantics;
- remediation authority separation;
- external-effect fact preservation;
- GC/evidence-gap behavior;
- offline/provider evidence portability;
- `CONFLICT`, `UNKNOWN`, `QUARANTINED`, `EVIDENCE_GAP` fidelity;
- security, compatibility, licensing, authority, currentness, UX, lifecycle, replaceability and lock-in remain mandatory evaluation dimensions.

## 11. Application Manager / Control Center / deployment implications

### Application Manager

Preserve `Install != Adopt != Qualify != Authorize` and `Discovered != Verified`.

A newly discovered forensic/PKI/HSM adapter can import candidate predecessor evidence but cannot mark it qualified merely because the provider returned it. Evidence qualification and remediation admission remain separate.

### Control Center

Control Center should explain:

- predecessor and current authority epochs;
- evidence provenance and authenticity;
- claimed effective interval vs observation time;
- affected trust/security/authority floors;
- affected credentials, deployments and effects;
- continuity-gap delta;
- remediation obligations and current disposition;
- GC/material availability consequences;
- inherited/local policy provenance.

`Automatic != hidden`: automatic impact discovery or remediation recommendation must expose its evidence and assumptions.

### Declarative service deployment / Vault/environment auto-binding

A service definition may require trust, KMS, vault or verification capabilities, but provider YAML/artifacts remain projections. Late evidence can trigger requalification of an effective binding without rewriting the semantic definition.

`Binding previously effective != binding indefinitely admissible`.

Auto-binding may propose a replacement provider/credential only under current policy, residency, licensing, compatibility, authority and security floors. `SecretRef != secret value` remains binding.

## 12. External mature tool reuse / plugin / adapter boundaries

Reuse remains preferred where specialist maturity dominates:

- PKI/CA, HSM/KMS, cloud vault, transparency and forensic consoles remain external candidates;
- Grafana/OpenTelemetry-class tools may project remediation/incident telemetry but are not canonical evidence authority;
- adapters preserve raw provider provenance and distinguish unsupported semantics from false equivalence;
- Deep-link is often safer than Embedded for privileged forensic/admin consoles;
- Native bridge is reserved for genuine local hardware/media integration.

`Adapter normalization != fabricated semantic equivalence`.

## 13. Proprietary editor/shared primitive implications

No new bespoke editor family is justified. Shared editor/application foundations should provide:

- immutable occurrence/evidence viewer;
- temporal interval/timeline primitive;
- provenance/currentness/confidence badges;
- epoch/floor compare;
- affected-scope/dependency explorer;
- remediation candidate preview;
- qualified command shell with revalidation;
- conflict/UNKNOWN/evidence-gap rendering;
- durable activity/progress projection;
- accessible non-graph equivalent.

The Workflow/View/Form/Component bridge remains unchanged:

`View != Workflow Activity`
`Form != Workflow State`
`Button != Domain Command`.

A remediation button invokes a separately authorized command; the view never becomes authority.

## 14. Componentization complexity map

Research decomposition only; not WBS.

### C1 — low / presentation reuse

- late-evidence/currentness badges;
- continuity-gap delta cards;
- affected-scope tables;
- pinned remediation alerts;
- accessible temporal summaries.

### C2 — moderate shared interaction foundations

- temporal evidence inspector;
- epoch/floor diff;
- affected-dependency explorer;
- remediation preview/review shell;
- durable incident/remediation activity projection;
- stale-window command revalidation.

### C3 — high semantic foundations with broad reuse

- `LatePredecessorEvidenceBoundary`;
- `EvidenceEffectiveIntervalBoundary`;
- `EvidenceObservationBoundary`;
- `PredecessorLineageResolutionBoundary`;
- `AuthorityEpochImpactBoundary`;
- `AffectedOccurrenceDiscoveryBoundary`;
- `CredentialDerivationImpactBoundary`;
- `DeploymentTrustRequalificationBoundary`;
- `ExternalEffectRemediationBoundary`;
- `ContinuityGapRevisionBoundary`;
- `LateEvidenceGCSafetyBoundary`;
- `PostRebootstrapRemediationBoundary`.

### Domain/application-specific work

Do not prematurely generalize legal incident classification, organizational emergency authority, provider-specific credential rotation, domain compensation, regulatory breach reporting, physical HSM/tape handling or business acceptance of historical effects.

## 15. Performance/resource budgets

No thresholds are invented. Future empirical budgets must measure:

- late-evidence ingestion/verification throughput;
- affected-occurrence graph fan-out and p50/p95/p99 reconciliation latency;
- number/bytes of historical dependency edges retained for impact analysis;
- credential/deployment/effect requalification backlog;
- provider API cost/rate limits;
- cold/offline evidence retrieval latency;
- UI projection cardinality without loading full proof blobs;
- remediation queue growth and minority-critical age;
- GC reclamation deferred by newly live evidence;
- storage cost of temporal/provenance indexes.

The Desktop should load summary/index state first and fetch full proof envelopes on demand.

## 16. Adversarial proof matrix

| Adversarial case | Required disposition |
|---|---|
| Retirement fence arrives months after E2 bootstrap | qualify authenticity/effective scope; never reactivate E1 automatically |
| CRL observed today claims key compromise before bootstrap | affected E2 derivations requalified; occurrences preserved |
| Late evidence proves E1 safe rather than unsafe | continuity gap may narrow; E2 still remains a historical authority transition |
| Late evidence conflicts with bootstrap witness | `CONFLICTING_PREDECESSOR_EVIDENCE`; no majority-by-count shortcut |
| Evidence authentic but effective interval unknown | `PARTIAL/UNKNOWN`; do not infer universal compromise |
| E2 credential derived from compromised E1 key | rotate/reissue under current qualified authority |
| E2 credential independent of E1 | do not rotate merely by temporal proximity; prove dependency |
| Deployment signed before compromise bound | preserve historical validity if policy permits; requalify current admissibility separately |
| Deployment signed inside newly established compromise interval | quarantine/replacement candidate; deployment occurrence remains fact |
| External payment already executed with later-disqualified authority | preserve effect; create remediation/compensation obligation |
| Predecessor worker resurfaces | late evidence does not grant it current effect authority |
| Old HSM package proves stronger retirement floor | raise predecessor floor; requalify affected current dependencies |
| HSM package itself is stale/rollback copy | reject/quarantine by lineage/currentness evidence |
| Provider API reports evidence but adapter cannot map semantics | preserve raw evidence + `UNKNOWN`; do not fabricate equivalence |
| Evidence arrives after proof GC but required material is gone | record `EVIDENCE_GAP/MATERIAL_UNAVAILABLE`; no fabricated proof |
| Evidence arrives before pending GC effect | invalidate/requalify GC intent before deletion |
| Secondary display still shows `NO IMPACT` | command path revalidates against current evidence revision |
| Restored browser session contains old remediation approval | approval must be revision/scope-bound or requalified |
| 9,999 unaffected credentials + 1 critical affected root | aggregate success must not hide minority-critical remediation |
| Late evidence has newer timestamp but weaker authority | timestamp does not make it authoritative |
| Two witnesses disagree on compromise interval | preserve conflict; no last-writer-wins |
| Provider account closed before evidence export | provider exit gap remains explicit |
| Evidence narrows continuity gap but cannot prove effect settlement | continuity and settlement remain separate |
| Evidence proves bootstrap authority itself compromised | initiate explicit current-epoch security re-establishment; no rollback to E1 |
| New authority re-establishment occurs | preserve E2 history and remediation lineage |
| AI recommends mass rotation from ambiguous evidence | candidate only; qualified policy/authority decides effect |
| Human approved remediation before affected set changed | stale approval cannot cover newly changed target set |
| Automatic binding selects replacement KMS | expose policy/provenance; no hidden authority transition |
| Historical proof is valid but current algorithm floor rejects it for new effects | preserve historical verification/new-effect separation |
| Offline media arrives with contradictory predecessor floor | quarantine/reconcile lineage before any restore/effect use |
| Remediation partially succeeds across providers | represent per-target `EFFECTIVE/PARTIAL/UNKNOWN`; no batch atomicity claim |
| Monitoring telemetry absent | absence does not prove remediation/effect absence |
| Window closes during long remediation | durable operation continues independently of interaction session |

## 17. Closure status / saturation

- Web Desktop hierarchy/taxonomy: **high**.
- Window/session/multi-display separation: **high**.
- Observatory vs Monitoring Surface vs Operations Desktop: **high**.
- Application Portfolio / Application Manager / Control Center: **medium-high**.
- catastrophic rebootstrap semantics: **medium-high conceptual**.
- late predecessor evidence temporal model: **medium-high conceptual**.
- predecessor-to-current dependency impact analysis: **medium**.
- remediation semantics across heterogeneous providers: **medium**.
- late-evidence impact on bounded GC: **medium**.
- empirical performance/resource budgets: **medium-low**.

Research remains active; material gaps remain.

## 18. Next research vector

The next material vector is **remediation closure and authority re-establishment after late predecessor evidence**: define when a current epoch that inherited a compromised dependency must itself transition to a successor epoch; distinguish ordinary credential/deployment rotation from authority-root rebootstrap; prove when all affected external-effect domains have been reconciled enough to close the incident; and prevent `99.99% remediated` from hiding one minority-critical unresolved authority/effect path.

## 19. Sources reviewed

Primary/authoritative sources reviewed 2026-09-23:

- RFC 5280 — PKIX Certificate and CRL Profile, especially revocation and `invalidityDate` semantics.
- Sigstore Threat Model — compromise-time marking, transparency monitoring, TUF trust-root recovery/freshness.
- Sigstore Security Model and timestamp/bundle documentation — historical inclusion/time evidence and verification material.
- NIST SP 800-61 Rev. 3 announcement/project material — incident response integrated across detection, response and recovery.

Repository sources: `AGENTS.md`, `docs/architecture/MASTER_BLUEPRINT.md`, `project_docs/generation-4/README.md`, `project_docs/generation-4/G4_RESEARCH_STATE.md`, prior Web Desktop/recovery research corpus, and latest Palantir benchmark outputs available on `research/g4-product-rnd-foundations`.
