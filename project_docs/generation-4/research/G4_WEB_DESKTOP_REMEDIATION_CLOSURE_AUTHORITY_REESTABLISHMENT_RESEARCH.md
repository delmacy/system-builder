# G4 Web Desktop — Remediation Closure & Authority Re-establishment After Late Predecessor Evidence

Date: 2026-09-23
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: documentary P&D only. No WBS, Work Package, Sprint, TASK, provider adoption or product implementation authority.

## 1. Research question

This round follows `G4_WEB_DESKTOP_LATE_PREDECESSOR_EVIDENCE_RECONCILIATION_RESEARCH.md`.

The prior round established that late predecessor evidence changes what can be proven about historical occurrences without rolling time backward. The unresolved question is closure: after impact discovery and remediation, when is the current authority epoch still trustworthy, and when did the current epoch inherit enough compromised authority that remediation must establish a successor authority epoch?

Core distinction:

`Resource remediation != authority remediation`.

And:

`99.99% remediated != authority-safe closure`.

A single unresolved root/issuer/bootstrap path can dominate thousands of remediated leaves.

## 2. Deduplication against the G4 corpus

This study preserves the established boundaries:

- `Builder != Runtime`; published runtimes remain autonomous within qualified currentness/security horizons;
- `UNKNOWN` is an evidence disposition, never permission to guess;
- historical occurrence/effect facts are immutable even when later found inadmissible;
- late predecessor evidence does not reactivate predecessor authority;
- catastrophic rebootstrap creates a new authority epoch and may honestly declare a continuity gap;
- evidence reconciliation and remediation execution are distinct;
- negative/revocation/fencing evidence must outlive resurrection paths or be subsumed by a stronger durable fence;
- `Provider ACK != effective state`;
- `Desired != Observed != Effective`;
- `Automatic != hidden`.

The active Station work on main confirms that the presentation shell is now materially evolving (window runtime, full titlebar, resize and multi-window/taskbar foundations), but this research does not mutate or direct that implementation. The semantic Web Desktop model remains `Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

## 3. External evidence and contradictory lessons

### 3.1 NIST SP 800-57 — compromise favors independent re-keying

NIST SP 800-57 Part 1 Rev. 5 distinguishes re-keying from key update. When a key is compromised, replacement should be independent of the compromised key; deriving successor key material from a compromised predecessor can propagate exposure.

Transferable lesson:

`New key identifier != independent new authority`.

If current authority depends cryptographically or procedurally on a compromised predecessor path, leaf rotation alone does not close the authority incident.

### 3.2 RFC 4986 / RFC 5011 — compromise recovery depends on an uncompromised anchor

DNSSEC trust-anchor rollover requirements explicitly require recovery from compromise while at least one other known-uncompromised trust anchor remains. RFC 5011 similarly describes recovery while a valid trust-anchor key survives; complete loss/compromise pushes recovery toward manual/out-of-band mechanisms.

Transferable lesson:

`Some current credentials healthy != current root authority healthy`.

Closure must ask whether an independent, qualified authority path survived, not count healthy leaves.

### 3.3 TUF — threshold root compromise changes the recovery class

TUF's operational guidance distinguishes ordinary compromised-key replacement from compromise of a threshold of Root keys. In the latter case, Root must be re-issued out of band.

Transferable lesson:

`Ordinary rotation != authority re-establishment`.

Crossing an authority-compromise threshold changes the class of recovery operation.

### 3.4 Sigstore — compromise time and distributed root holders

Sigstore combines threshold root signing, offline roots, key rotation/revocation, compromise-time evidence and distributed root holders. This supports temporal containment and failure-domain independence rather than one global binary `trusted` flag.

Transferable lesson:

`Authority closure is dependency- and failure-domain-sensitive`.

## 4. Material finding — closure follows authority dependency cuts, not remediation percentages

The architecture needs to distinguish at least four remediation scopes:

1. **leaf/resource remediation** — session, token, workload credential, deployment, binding, artifact or provider resource;
2. **issuer/intermediate remediation** — CA/KMS issuer, signing service, delegated authority or credential minting path;
3. **authority-plane remediation** — root/threshold/bootstrap/recovery authority and its qualifying ceremony;
4. **external-effect remediation** — compensation, reconciliation or acceptance of already-realized external effects.

A current authority epoch `E2` remains usable only if there exists a qualified authority path for `E2` that does not depend on the newly disqualified predecessor material for the protected authority invariant.

Candidate rule:

`CurrentEpochRetainable(E2) := exists QualifiedIndependentAuthorityPath(E2) AND no unresolved critical authority cut AND required negative/fencing evidence is effective`.

If every authority path to `E2` crosses compromised predecessor material, leaf rotation under `E2` is circular. A successor authority epoch is required.

`Rotate leaves under compromised root != authority re-established`.

## 5. Candidate semantic model

### 5.1 RemediationClosureClaim

```text
RemediationClosureClaim
  clientRef
  incident/evidenceSetRef
  currentAuthorityEpoch
  protectedInvariantScope
  affectedSetSummary
  criticalAuthorityCutSet
  independentAuthorityPaths
  resourceRemediationCoverage
  issuerRemediationCoverage
  authorityRemediationDisposition
  externalEffectDisposition
  negativeFenceDisposition
  providerObservedEffects
  unknowns
  closureDisposition
  evidenceFrontier
  evaluatedAt
```

The claim is evidence, not command authority.

### 5.2 Authority dependency edge classes

Candidate edge classes:

- `DERIVED_KEY_FROM`
- `SIGNED_BY`
- `ISSUED_BY`
- `BOOTSTRAP_AUTHORIZED_BY`
- `RECOVERY_AUTHORIZED_BY`
- `THRESHOLD_MEMBER_OF`
- `DELEGATED_FROM`
- `FENCED_BY`
- `PROVIDER_EFFECT_AUTHORIZED_BY`
- `HISTORICAL_VERIFY_ONLY`
- `UNKNOWN_DEPENDENCY`

`HISTORICAL_VERIFY_ONLY` must never be treated as current authority merely because verification still succeeds.

### 5.3 Closure dispositions

- `NO_REMEDIATION_REQUIRED`
- `RESOURCE_REMEDIATION_OPEN`
- `ISSUER_REMEDIATION_OPEN`
- `AUTHORITY_REESTABLISHMENT_REQUIRED`
- `EXTERNAL_EFFECT_RECONCILIATION_OPEN`
- `CRITICAL_UNKNOWN_OPEN`
- `CLOSURE_ELIGIBLE`
- `CLOSURE_EFFECTIVE`
- `PARTIAL`
- `CONFLICTING_EVIDENCE`
- `UNKNOWN`

## 6. Authority re-establishment decision

A new authority epoch is required when any protected authority invariant has no surviving qualified independent path. Candidate triggers include:

- bootstrap/recovery ceremony depended on a now-disqualified predecessor root/issuer;
- threshold compromise leaves no known-uncompromised threshold satisfying the authority policy;
- successor key material was derived from compromised predecessor material in a way that does not provide independence;
- current issuer/delegation lineage is wholly downstream of the compromised predecessor path;
- current fencing/negative-evidence authority itself is not independently trustworthy;
- the only surviving path is `UNKNOWN` for a critical authority invariant.

A new epoch is not automatically required when:

- affected leaf credentials can be independently reissued under a still-qualified current root;
- a compromised provider credential is replaceable without contaminating current root/issuer authority;
- a deployment artifact is requalified/replaced while the authority plane remains independently trustworthy;
- historical verification material is compromised for new effects but bounded temporal evidence proves the current authority path independent.

Core rule:

`Compromise proximity != demonstrated authority dependency`.

Do not mass-rotate or epoch-bump merely because resources share time, provider or UI proximity.

## 7. State machine

```text
REMEDIATION_OPEN
  -> IMPACT_GRAPH_QUALIFYING
  -> AUTHORITY_DEPENDENCY_CUT_EVALUATING
  -> INDEPENDENT_PATH_QUALIFYING
  -> RESOURCE_REMEDIATION_RECONCILING
  -> ISSUER_REMEDIATION_RECONCILING
  -> NEGATIVE/FENCE_EFFECT_RECONCILING
  -> EXTERNAL_EFFECT_RECONCILING
  -> CRITICAL_UNKNOWN_EVALUATING
     -> CURRENT_EPOCH_RETAINABLE
     -> AUTHORITY_REESTABLISHMENT_REQUIRED
     -> PARTIAL
     -> CONFLICTING_EVIDENCE
     -> UNKNOWN

CURRENT_EPOCH_RETAINABLE
  -> CLOSURE_PROOF_BUILDING
  -> CLOSURE_DURABILITY_VERIFYING
  -> CLOSURE_EFFECTIVE

AUTHORITY_REESTABLISHMENT_REQUIRED
  -> SUCCESSOR_AUTHORITY_POLICY_QUALIFYING
  -> INDEPENDENT_BOOTSTRAP_MATERIAL_QUALIFYING
  -> SUCCESSOR_EPOCH_ESTABLISHING
  -> OLD_EPOCH_NEW_EFFECTS_FENCING
  -> CREDENTIAL/ISSUER_REISSUANCE
  -> DEPLOYMENT/BINDING_REQUALIFICATION
  -> EXTERNAL_EFFECT_RECONCILIATION
  -> SUCCESSOR_CLOSURE_PROOF_BUILDING
  -> SUCCESSOR_CLOSURE_DURABILITY_VERIFYING
  -> CLOSURE_EFFECTIVE
```

`Closure proof built != closure durable`.

`Closure durable != every historical effect compensated`; explicitly accepted residual obligations may remain if policy/domain semantics permit them, but they cannot be silently relabeled as absent.

## 8. Minority-critical protection

Aggregate completion percentages are non-authoritative for closure.

A closure projection may show throughput percentages for operations, but semantic closure requires zero unresolved **critical cut** for the protected invariant or an explicit policy disposition that preserves the unresolved state.

Examples:

- 9,999 rotated workload tokens + one compromised root = authority closure blocked;
- 10,000 clean deployments + one unfenced predecessor signer = new-effect authority potentially blocked;
- one irreversible payment effect `UNKNOWN` does not necessarily invalidate root authority, but external-effect closure remains open;
- one offline HSM package `UNKNOWN` blocks authority closure only if it can still answer/resurrect a critical authority path under the declared coverage model.

`Count majority != authority majority`.

## 9. Web Desktop synthesis

No structural change to the Web Desktop hierarchy is required.

### Desktop Sphere taxonomy

Security/Recovery/Operations remains a functional Desktop Sphere, not a runtime or deployment boundary. 3D remains an optional application/projection, never the navigation foundation.

### Observatory vs Pinned Monitoring Surface vs Operations Desktop

- **Desktop Observatory:** read-oriented closure posture, critical cuts, independent-path evidence, remediation backlog, residual external effects and currentness.
- **Pinned Monitoring Surface:** compact warnings such as `AUTHORITY RE-ESTABLISHMENT REQUIRED`, `CRITICAL UNKNOWN OPEN`, `OLD EPOCH NOT FENCED`; no authority-changing controls.
- **Operations Desktop:** qualified epoch transition, issuer/credential rotation, fencing, provider reconciliation and closure proof actions.

`Monitoring acknowledgement != remediation closure`.

### Window Manager / multi-display / session restore

Window remains an interaction session. Closure state is durable outside the window lifecycle. Restored windows and secondary displays must revalidate evidence revision and authority epoch before consequential commands.

`Window focused != authority current`.

Accessibility/small-screen equivalence requires non-graph tables/lists for critical cut sets, independent paths, open unknowns, remediation classes and closure disposition.

## 10. Application Portfolio Matrix delta

No universal integration mode is selected.

| Capability/task | Preferred modes | Boundary |
|---|---|---|
| Authority dependency graph / closure proof | Native SB | semantic authority/lineage/closure disposition are SB-owned |
| PKI/CA issuer rotation | API-backed / Hybrid / Deep-link | mature CA semantics reused; SB preserves semantic qualification and provenance |
| HSM/KMS root/threshold operation | API-backed / Hybrid / Deep-link / Native bridge | hardware/provider-specific; Native bridge only for genuine local hardware |
| Cloud IAM/session/token remediation | API-backed / Hybrid | provider effects observed separately from requested rotation/revocation |
| Deployment/artifact requalification | Native SB + Hybrid / Deep-link | SB owns admissibility; provider tooling remains reusable |
| Transparency/revocation evidence | Native SB / API-backed / Hybrid | portable local verification where possible; provider currentness/export where needed |
| External-effect reconciliation | Native semantic model + Hybrid / Deep-link | domain/provider-specific effect facts and compensation semantics remain external |
| Forensic/incident specialist console | Deep-link / Embedded-qualified / Hybrid | privileged mature tooling reused; embed only with isolation/capability qualification |
| Offline HSM/media inspection | Hybrid / Native bridge | host/hardware access may be unavoidable; inspection never self-authorizes |

### Matrix criteria refined

Security, compatibility, licensing, authority, currentness, UX, lifecycle, replaceability and lock-in remain mandatory. Add:

- independent-authority-path fidelity;
- threshold/issuer lineage fidelity;
- key-derivation independence;
- negative/fencing-effect observability;
- provider revocation/rotation residuals;
- historical-verify-only separation;
- closure-proof portability;
- critical-UNKNOWN fidelity;
- successor-epoch exportability/provider exit;
- authority-plane vs external-effect closure separation.

## 11. Application Manager / Control Center / declarative deployment

### Application Manager

Preserve `Install != Adopt != Qualify != Authorize` and `Discovered != Verified`.

Installing a PKI/HSM/IAM adapter does not qualify it to participate in authority re-establishment. Qualification must include supported authority semantics, provenance, currentness, provider residual visibility, licensing, isolation and exit behavior.

### Control Center

Control Center should explain:

- current and predecessor authority epochs;
- why the current epoch is retainable or not;
- critical authority cut sets;
- surviving independent authority paths;
- affected credentials/issuers/deployments/effects;
- provider-requested vs provider-observed remediation;
- negative/fence effectiveness;
- critical `UNKNOWN`s;
- closure disposition and provenance;
- inherited/local policy affecting closure.

`Automatic != hidden`: automated remediation recommendations must expose dependency assumptions and cannot close the incident automatically merely because completion metrics are high.

### Declarative service deployment / Vault/environment auto-binding

Semantic service definitions remain provider-independent. Late evidence can make an effective provider/credential binding inadmissible without rewriting the service definition.

Auto-binding may propose a replacement only under current authority/security/residency/licensing/compatibility policy. A replacement binding is not effective until observed and qualified.

`Register != Deploy`; `Desired != Observed != Effective`; `SecretRef != secret value` remain binding.

## 12. Hosting/placement and external mature tool reuse

Placement does not create authority. Moving an app, service, vault or HSM integration to a new host does not repair a compromised authority lineage.

Reuse mature PKI/CA, HSM/KMS, cloud IAM, transparency, SIEM/observability and forensic tools where their specialist maturity dominates. Prefer API/Hybrid/Deep-link over rebuilding privileged consoles. Embedded is conditional on isolation, licensing, CSP/frame compatibility, session security and authority boundaries. Proxied mode must not silently transform origin/authentication semantics. Native bridge remains reserved for genuine local OS/hardware/media needs.

`Adapter normalization != fabricated semantic equivalence`.

## 13. Proprietary editor foundation / Workflow-View-Form-Component bridge

No new bespoke editor family is justified. Shared primitives should cover:

- immutable evidence/occurrence viewer;
- authority epoch and lineage diff;
- critical-cut/dependency explorer;
- currentness/provenance/UNKNOWN badges;
- remediation preview;
- qualified command shell with pre-effect revalidation;
- durable activity/effect observation;
- conflict/residual obligation rendering;
- accessible textual equivalent to graphs.

The semantic bridge remains:

`View != Workflow Activity`
`Form != Workflow State`
`Button != Domain Command`.

A button can request `EstablishSuccessorAuthorityEpoch`; it does not become the authority transition itself.

## 14. Componentization complexity map

Research decomposition only; not WBS.

### C1 — low/presentation reuse

- authority/closure badges;
- critical-unknown warnings;
- closure summaries;
- independent-path tables;
- pinned remediation alerts.

### C2 — moderate shared interaction foundations

- authority lineage explorer;
- critical-cut visualization + accessible table;
- remediation review/preview shell;
- provider requested-vs-observed diff;
- durable closure activity projection;
- stale-window/epoch command revalidation.

### C3 — high semantic foundations with broad reuse

- `AuthorityDependencyBoundary`;
- `CriticalAuthorityCutBoundary`;
- `IndependentAuthorityPathBoundary`;
- `RemediationClosureClaimBoundary`;
- `CurrentEpochRetainabilityBoundary`;
- `AuthorityReestablishmentBoundary`;
- `SuccessorAuthorityEpochBoundary`;
- `NegativeFenceEffectBoundary`;
- `ProviderRemediationObservationBoundary`;
- `MinorityCriticalClosureBoundary`;
- `ExternalEffectClosureBoundary`;
- `ClosureDurabilityBoundary`.

### Domain/application-specific work

Do not prematurely generalize organizational emergency authority, legal incident closure, provider-specific CA/HSM ceremony, business compensation, regulatory breach closure, physical key/media handling or domain acceptance of residual effects.

## 15. Performance/resource budgets

No thresholds are invented. Future empirical budgets must measure:

- authority dependency graph cardinality/fan-out;
- impact/critical-cut analysis p50/p95/p99 latency;
- credential/issuer rotation throughput and provider throttling;
- time from requested to observed fence/revocation effect;
- closure-proof size and verification CPU;
- stale/UNKNOWN evidence rate;
- remediation retry amplification;
- provider API cost/rate limits;
- secondary-display/currentness propagation latency;
- successor-epoch requalification fan-out;
- offline/HSM inspection latency.

Performance pressure cannot convert `UNKNOWN` into success or skip authority-path qualification.

## 16. Adversarial proof matrix

Future proof must include at least these cases:

1. 9,999 leaf credentials rotated; one root remains compromised.
2. Current root independent; one provider token compromised.
3. Current root was signed/bootstrap-authorized solely by compromised predecessor material.
4. Threshold 3-of-5 with one compromised key.
5. Threshold 3-of-5 with three compromised keys.
6. Successor key identifier new but key derived from compromised predecessor secret.
7. Successor key generated independently but stored in the same compromised HSM failure domain.
8. Old issuer disabled locally but provider still accepts it.
9. Provider revocation ACK returned; observed effect remains unknown.
10. Historical verification succeeds with a key retired for new effects.
11. One unfenced predecessor worker can still call an external provider.
12. Deployment replaced but old signing authority remains admissible.
13. Root authority clean; one irreversible payment effect remains unknown.
14. All credentials clean; external compensation remains open.
15. Offline HSM package may contain a still-valid authority path.
16. Offline HSM package is historical-verify-only.
17. Current authority path depends on a late-discovered compromised intermediate.
18. Current authority path has an independent uncompromised threshold path.
19. AI recommends mass rotation based only on temporal proximity.
20. Two providers report conflicting revocation state.
21. Secondary display shows `CLOSURE_ELIGIBLE` after a new critical finding.
22. Restored window carries stale epoch admission.
23. Adapter reports unsupported revocation semantics as `revoked=false`.
24. Adapter uninstall is mistaken for provider authority removal.
25. New epoch established but old epoch not effect-fenced.
26. New epoch established using the same compromised recovery ceremony.
27. New epoch independently established but one binding remains under old credentials.
28. Closure proof exists only in volatile storage.
29. Closure proof durable but evidence frontier omitted a known recovery domain.
30. Late evidence arrives after closure and widens the compromise interval.
31. GC removed material needed to answer the late question; result must become `EVIDENCE_GAP`, not fabricated safe.
32. `99.99% remediated` hides one critical `UNKNOWN` authority edge.
33. Majority of threshold holders healthy but policy threshold cannot be proven current.
34. Provider migration changes identity/issuer semantics during remediation.
35. Automatic replacement violates residency/licensing policy.
36. Closure dashboard green because it counts requests rather than observed effects.

## 17. Saturation / closure status

- Web Desktop hierarchy/taxonomy: **high saturation**.
- Window Manager/multi-display/session separation: **high**.
- Observatory vs Monitoring Surface vs Operations Desktop: **high**.
- Application Portfolio / Application Manager / Control Center: **medium-high**.
- Late-predecessor temporal reconciliation: **medium-high**.
- Remediation scope taxonomy: **medium-high**.
- Current-epoch retainability rule: **medium-high conceptually**.
- Critical authority cut / independent path semantics: **medium; needs more distributed-threshold/organizational evidence**.
- Heterogeneous provider observed-effect closure: **medium**.
- External-effect closure: **medium and domain-specific**.
- Empirical performance/resource budgets: **medium-low**.

Research is not complete while these material gaps remain.

## 18. Next deep-gap vector

Next material vector:

**authority-epoch overlap/drain and zero-downtime re-establishment**.

Questions:

- can an old authority epoch remain historical/verification-only while a successor becomes effective without a global stop-the-world barrier?
- what exact operations may continue during overlap and which require hard fencing?
- how do queued/in-flight effects retain their original admission epoch without being silently upgraded?
- how do multi-display/session restore and external provider credentials avoid stale-epoch resurrection?
- how is overlap bounded when one provider cannot atomically revoke the predecessor and activate the successor?
- how do we prove `new epoch effective` separately from `old epoch fully drained/fenced`?

This remains research-only.