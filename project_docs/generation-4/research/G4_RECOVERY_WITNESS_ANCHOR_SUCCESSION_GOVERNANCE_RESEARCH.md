# G4 Web Desktop — Recovery Witness / Anchor Succession Governance Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`  
Date: 2026-09-23  
Scope: documentary P&D only on `research/g4-product-rnd-foundations`. No product implementation, WBS, Work Package, Sprint, TASK, migration or provider adoption is authorized.

## 1. Research question

How should G4 preserve rollback-resistant recovery evidence when witnesses or anti-rollback anchors are lost, migrated, compromised, correlated, forked or legitimately superseded, without turning Factory/Control Center into a mandatory online oracle and without allowing a stale snapshot to authorize its own safety frontier?

This continues the prior `TemporalEvidenceFrontier`, `RecoveryEpoch` and `RecoverySafetyFrontier` research. It reconciles the Web Desktop / Application Environment with Application Manager, Control Center, declarative deployment, placement, Vault bindings and desired/observed/effective/currentness/evidence semantics.

Primary hierarchy remains a research candidate:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

3D remains an optional projection/application, not a mandatory navigation foundation.

## 2. Repository and predecessor constraints

Preserved constitutional rules:

- `Builder != Runtime`; published runtimes remain autonomous.
- `Release + Environment = Deployment`; provider realization is not semantic ownership.
- `Install != Adopt`; `Register != Deploy`; `Connect != Own`; `Discovered != Verified`.
- `SecretRef != secret value`.
- `Policy != configuration`.
- `Desired != Observed != Effective`; `Configured != Applied != Effective`.
- `Unified UI != one semantic owner/store`.
- `Deployment Unit != physical server`; `Service identity != raw IP`.
- `Window/session lifecycle != service lifecycle`.
- `Automatic != hidden`.
- `Adapter normalization != fabricated equivalence`.

Predecessor recovery laws remain binding research hypotheses:

- `Restored bytes != restored authority`.
- `Backup integrity != recovery admissibility`.
- `Replica promoted != replica has latest negative evidence`.
- `RecoveryPoint != RecoverySafetyFrontier != RestoreAuthority != RestoredRuntime`.
- `FRONTIER SIGNATURE VALID != FRONTIER CURRENT`.
- `PERSISTED LOCALLY != ROLLBACK RESISTANT`.
- `TPM/HSM COUNTER PRESENT != BUSINESS AUTHORITY PROVEN`.
- `EXTERNAL WITNESS != GLOBAL ONLINE ORACLE`.

The :00 delta adds organizational-authority succession: identity, representative capacity, credential and authority scope/currentness are distinct; organizational succession is many-to-many and scope-qualified. The :10 delta adds simulation discipline: simulation is evidence-producing only, population/coverage/UNKNOWN are first-class, and preview never becomes activation authority.

## 3. External evidence and extracted grammar

### 3.1 TUF — trusted-root succession is predecessor-qualified, not newest-wins

The Update Framework separates signed roles, version/expiration and delegation. Clients can refuse metadata older than previously seen; root metadata controls trusted keys/thresholds and root-key compromise requires explicit replacement or out-of-band recovery when the root threshold itself is lost.

Extracted grammar:

`trusted predecessor -> qualified successor metadata -> successor trust`

not:

`new key/version exists -> successor trusted`.

This supports explicit anchor succession and anti-rollback floors without adopting TUF as the G4 protocol.

### 3.2 Sigstore/Rekor — append-only transparency needs monitoring and supports log/key rotation

Rekor is an append-only Merkle transparency log. Signed tree heads can be independently verified, and Sigstore explicitly states that long-term trust requires monitoring. Rekor sharding freezes an old tree and creates a successor tree, including signing-key rotation and platform migration use cases.

Extracted grammar:

`append-only evidence + signed checkpoint + independent monitoring + explicit shard/signer succession`.

Important limitation:

`inclusion proof != current business authority` and `signed tree head != complete recovery frontier`.

### 3.3 etcd restore — monotonic presentation can invalidate caches but cannot recreate missing semantics

etcd documents that restoring an old snapshot makes revision appear to move backwards; revision bump plus compaction can invalidate stale watch caches. Restore creates a new logical cluster identity. The revision bump prevents decreasing revisions from being mistaken for continuity, but it does not reconstruct writes absent from the snapshot.

Extracted grammar:

`anti-rollback presentation repair != missing semantic history reconstruction`.

This is directly relevant to successor anchors: a new anchor generation can establish a new floor but cannot fabricate negative evidence lost before migration.

## 4. Core model candidates

### 4.1 RecoveryAnchor

A recovery anchor is a claim-scoped anti-rollback evidence source, not a business owner.

Candidate envelope:

```text
RecoveryAnchor {
  anchorSemanticId
  anchorEpochId
  anchorKind
  clientScope
  environmentScope?
  protectedClaimClasses[]
  trustProfileRef
  authorityBasisRef
  predecessorAnchorRefs[]
  successorAnchorRefs[]
  failureDomainRef
  providerOrOperatorRef?
  currentness
  status
  evidenceRefs[]
}
```

Candidate statuses:

`ACTIVE | DEGRADED | UNAVAILABLE | DESTROYED | COMPROMISED | CONTRADICTED | SUPERSEDED | RETIRED | UNKNOWN`.

Hard rules:

`Anchor identity != provider endpoint`.

`Anchor reachable != anchor current`.

`Anchor signature valid != anchor uncompromised`.

`Anchor unavailable != anchor contradicted`.

`Anchor destroyed != anchor superseded`.

### 4.2 AnchorSuccessionOccurrence

Anchor migration/succession is an explicit occurrence:

```text
AnchorSuccessionOccurrence {
  occurrenceId
  predecessorAnchors[]
  successorAnchors[]
  protectedClaimClasses[]
  predecessorFrontierRefs[]
  successorInitialFrontierRef
  authorityEvidenceRefs[]
  continuityEvidenceRefs[]
  gapClaims[]
  unknownClaims[]
  effectiveScope
  admittedAt
  verifiedAt?
}
```

It does not rewrite predecessor history.

`Successor anchor != predecessor anchor renamed`.

`Anchor migration != authority reset`.

### 4.3 WitnessObservation

A witness observes/commits a qualified frontier or checkpoint:

```text
WitnessObservation {
  witnessId
  witnessEpochId
  subjectScope
  frontierDigest
  frontierGeneration
  coverageClaim
  observedAt
  trustProfileRef
  failureDomainRef
  signatureOrAttestationRef
  disclosureProfileRef
}
```

A witness is not automatically authoritative for every claim represented inside a frontier.

`Witnessed digest != witnessed semantics understood`.

`Witness quorum != business consensus`.

## 5. Primary findings

### F351 — Anchor succession requires predecessor-qualified continuity or explicit re-bootstrap

A new provider, HSM, witness set or recovery account cannot declare itself the successor merely because it has the newest timestamp or administrator approval. Succession must be qualified by predecessor evidence, independent organizational/recovery authority, or an explicit re-bootstrap path that admits continuity gaps.

`SUCCESSOR_PRESENT != SUCCESSION_PROVEN`.

### F352 — A stale snapshot cannot authorize its own successor floor

A restored runtime may propose a frontier, but that same rolled-back state cannot be the sole evidence that its frontier is the highest legitimate one.

At least one anti-rollback basis must be outside the rollback domain being admitted: qualified predecessor anchor, independent witness, provider immutability/version history, hardware monotonic evidence, or explicit fresh recovery authority with declared UNKNOWN/gap semantics.

`SELF_ATTESTED_RESTORED_FLOOR != ROLLBACK_PROOF`.

### F353 — Witness diversity is claim- and failure-model-specific

Counting witnesses is insufficient. Three witnesses on one provider/account/credential/control plane may share one correlated failure domain.

Candidate diversity dimensions include:

- provider/account/region/control-plane separation;
- operator/administrative authority separation;
- implementation diversity where material;
- cryptographic/trust-root separation;
- storage/retention independence;
- network/failure-domain independence;
- organizational authority separation;
- jurisdiction where policy requires it.

`More witnesses != automatic truth`.

`3 correlated witnesses != 3 independent witnesses`.

### F354 — Quorum is an evidence policy, not global truth

A quorum may establish that a declared anti-rollback policy is satisfied under declared assumptions. It does not establish business ownership, effect settlement, policy correctness or semantic completeness.

`Witness quorum PASS != Recovery globally safe`.

### F355 — Anchor loss has typed semantics

`UNAVAILABLE`, `DESTROYED`, `COMPROMISED`, `CONTRADICTED` and `LEGITIMATELY_SUPERSEDED` have different consequences.

- unavailable: current evidence cannot be obtained now;
- destroyed: the old anchor cannot produce future evidence;
- compromised: evidence from the affected epoch requires distrust/requalification according to policy;
- contradicted: qualified evidence conflicts;
- superseded: an explicit qualified successor relation exists.

A UI badge `offline` cannot collapse these states.

### F356 — Provider migration preserves semantic anchor lineage while changing realization

Moving a witness/anchor from provider A to B may preserve a semantic anti-rollback role, but provider-specific guarantees, retention, identity, timestamps and immutability semantics require requalification.

`Provider migration != semantic identity reset`.

`Same semantic anchor role != same guarantee vector`.

### F357 — Old-provider loss does not make old negative evidence irrelevant

If provider A becomes unavailable after recording credential revocation, erasure tombstone, management handoff or security floor, provider B cannot infer absence merely because A is unreachable.

`Old provider unavailable != old negative evidence irrelevant`.

A qualified compact frontier may subsume the old evidence only if dominance/coverage is proven.

### F358 — Successor bootstrap must carry a continuity/gap vector

Successor initialization should classify each protected claim dimension as:

`CONTINUITY_PROVEN | DOMINATED_BY_SUCCESSOR_FLOOR | GAP_KNOWN | GAP_UNKNOWN | NOT_APPLICABLE`.

No generic `migration successful` is sufficient.

### F359 — Forked/contradictory witnesses produce dispute, not majority truth by default

If witnesses report incompatible frontiers, the system must classify provenance, epochs, coverage, failure domains and authority. Majority voting is valid only when a declared witness policy says that the assumed failure model makes it sufficient.

`2-of-3 != truth` absent the policy/assumptions that give 2-of-3 meaning.

### F360 — Witness freshness and frontier freshness are independent

A fresh witness response can attest an old frontier. Conversely, a current frontier may have only older durable witness evidence.

`Fresh response != fresh frontier`.

### F361 — Monitoring is part of transparency assurance

Append-only/log inclusion alone does not prove absence of equivocation or operational compromise. Independent monitoring/auditing is a separate assurance dimension.

`Append-only != non-equivocation`.

`Inclusion proof != monitor agreement`.

### F362 — Witnessing must be privacy/minimization aware

A frontier commitment should avoid raw secrets, secret values, tenant-sensitive payloads and unnecessary identifiers. Per-Client scoping and purpose-bound commitments are preferred.

`SecretRef != secret value` remains absolute.

`Digest disclosure != automatically privacy-safe`.

### F363 — Anchor/witness governance follows Client sovereignty

Factory may host or coordinate a witness but cannot silently become the Client's permanent sovereign root. Organizational-authority succession from the :00 research applies to who may authorize anchor replacement/re-bootstrap.

`Factory administration != Client sovereignty`.

`Factory witness != Factory ownership`.

### F364 — Recovery simulation can test anchor-loss scenarios but cannot authorize migration

The :10 simulation model applies directly. Dry-run can evaluate provider loss, correlated witness failure, stale frontier and successor coverage, but:

`SIMULATED_SUCCESSION_PASS != SUCCESSION_ADMITTED`.

### F365 — Anchor succession and management succession are independent

An Application may move `SB_MANAGED -> EXTERNALLY_MANAGED` while its recovery anchor remains unchanged, or an anchor may migrate while management ownership remains unchanged.

`Anchor succession != Application management handoff`.

### F366 — Anchor succession and placement migration are independent

Moving a Service to another host/provider does not automatically migrate its anti-rollback anchor; migrating the anchor does not reidentify the Service.

`Placement migration != Service identity change`.

`Anchor migration != placement migration`.

### F367 — Raw provider artifacts remain projections

Provider manifests, KMS metadata, log checkpoints and API payloads may carry realization evidence, but the canonical semantic contract remains the G4 anchor/frontier model.

`Provider artifact != canonical truth`.

### F368 — Automatic anchor/witness binding must remain explainable

Environment or placement defaults may automatically select witnesses/anchors only if the resolved dependency, provenance, failure-domain assumptions, currentness and consequence are inspectable.

`Automatic != hidden`.

## 6. Witness-policy candidate

A future policy may express, without freezing implementation:

```text
WitnessPolicy {
  protectedClaimClass
  minimumQualifiedWitnesses
  diversityPredicates[]
  maximumCorrelatedFailureAssumption
  allowedAnchorKinds[]
  freshnessRequirements[]
  continuityRequirements[]
  providerLossDisposition
  contradictionDisposition
  emergencyRebootstrapRules
}
```

The output is a qualified evidence disposition, not a global boolean:

`QUALIFIED | DEGRADED | CONTRADICTED | STALE | INSUFFICIENT_DIVERSITY | GAP_KNOWN | UNKNOWN`.

## 7. Succession state machine candidate

```text
SUCCESSOR_PROPOSED
-> PREDECESSOR_EVIDENCE_RESOLVING
-> ORGANIZATIONAL_AUTHORITY_REQUALIFYING
-> FRONTIER_CONTINUITY_CHECKING
-> DIVERSITY/FAILURE_DOMAIN_CHECKING
-> SUCCESSOR_BOOTSTRAP_PREPARED
-> DUAL_WITNESS_OVERLAP | REBOOTSTRAP_WITH_DECLARED_GAP
-> SUCCESSOR_OBSERVATION_CONFIRMED
-> PREDECESSOR_RETIREMENT_ELIGIBLE
-> SUPERSEDED
```

Failure/uncertainty states:

`PREDECESSOR_UNAVAILABLE | PREDECESSOR_COMPROMISED | FRONTIER_GAP | WITNESS_CONTRADICTION | AUTHORITY_DISPUTED | DIVERSITY_INSUFFICIENT | CURRENTNESS_UNKNOWN | BLOCKED`.

Dual-witness overlap is preferable where feasible because it proves that old and new systems observed a common frontier. It is not mandatory when the predecessor is destroyed; that case must use explicit re-bootstrap/gap semantics rather than fake continuity.

## 8. Application Manager reconciliation

The Application Manager must preserve lifecycle and authority boundaries through recovery-anchor changes:

- install/adopt remains explicit after restore;
- discovered external applications remain unverified until qualified;
- `SB_MANAGED`, `EXTERNALLY_MANAGED`, `CO_MANAGED`, `OBSERVE_ONLY` do not change because an anchor provider changes;
- anchor migration does not authorize application upgrade/uninstall/redeploy;
- supply-chain/source integrity remains distinct from recovery-frontier currentness;
- credentials used to query witnesses do not imply target-management credentials.

`Can verify recovery evidence != Can manage application`.

## 9. Control Center reconciliation

Control Center may project:

- current anchor/witness topology by Client/Environment;
- inheritance/provenance of witness policy;
- protected claim classes;
- provider/failure-domain diversity;
- frontier generation/currentness;
- predecessor/successor anchor lineage;
- contradiction/gap/UNKNOWN;
- migration/re-bootstrap plan;
- blast radius and affected recovery points;
- application-specific advanced settings through owned adapters.

It must preserve:

`Policy != configuration`.

`Global witness-policy change != immediate provider mutation`.

`Configured successor != Applied successor != Effective qualified successor`.

A global setting that changes required witness diversity may invalidate recovery admissibility without restarting services. It must not trigger an unexpected restart/redeploy.

## 10. Declarative service deployment / placement reconciliation

Typed service schemas may reference a recovery/witness requirement and Environment defaults may resolve candidate bindings. Compilation may emit provider-specific log/KMS/storage configuration, but:

`Deployment Unit != physical server`.

`Service identity != witness endpoint`.

`Provider ACK != anchor effective`.

`Provider log created != witness policy satisfied`.

Placement migration must preserve Service semantic identity and separately qualify anchor continuity. Existing-service/BYOI placement may use external witnesses without transferring ownership.

Raw-manifest escape hatches remain non-canonical. A YAML field naming a log or KMS key is a provider realization, not the semantic WitnessPolicy.

## 11. Vault / secret auto-binding reconciliation

Witness authentication may need credentials, but witness payloads should contain commitments/references, never secret values. Automatic binding must expose:

- `SecretRef` identity/provenance;
- consumer/witness scope;
- credential generation/currentness;
- rotation/fencing dependency;
- fallback behavior if the credential is unavailable.

`Witness credential current != witness frontier current`.

`Witness credential rotated != old credential target-side fenced`.

## 12. Web Desktop / Observatory / Pinned Monitoring Surfaces

Desktop taxonomy remains functional. Candidate surfaces:

- Recovery/Continuity Application — authoritative interaction surface for qualified recovery operations;
- Control Center — policy/configuration/provenance/change planning;
- Desktop Observatory — read-oriented fleet/Client recovery-health projection;
- Pinned Monitoring Surface — narrow read-only anchor/frontier status;
- Application Manager — application lifecycle/management binding;
- specialist provider console — API-backed/hybrid/deep-link where provider semantics are richer than safe normalization.

Hard UI boundaries:

`Window close != witness stop`.

`Unpin != anchor retired`.

`Workspace restore != witness policy current`.

`Green monitoring surface != restore authorized`.

## 13. Proprietary editor family

Shared editor primitives should expose anchor/frontier refs, provenance, currentness, contradiction, lineage, scope and impact without owning recovery semantics.

Revision/Diff needs semantic facets for:

- witness policy revision;
- anchor epoch;
- predecessor/successor relation;
- protected claim classes;
- diversity assumptions;
- provider/failure-domain changes;
- frontier continuity/gaps;
- emergency re-bootstrap basis.

Preview/Sandbox can simulate anchor loss/provider migration using pinned fixtures, but `previewed recovery safety != effective recovery safety`.

## 14. Adversarial scenarios

1. tenant A's witness commitment is accepted for tenant B because both share a provider account;
2. stale Workspace restores an old witness topology and labels it current;
3. witness API credential is displayed in diff/log evidence;
4. restored discovered application becomes adopted because its old witness still responds;
5. externally managed app is upgraded during anchor migration;
6. global witness-diversity policy silently restarts every runtime;
7. shared witness infrastructure is interpreted as shared data/authority;
8. provider transparency-log checkpoint becomes canonical frontier truth;
9. closing Recovery Application window stops witness replication;
10. adapter maps provider log inclusion to semantic recovery admissibility;
11. placement migration changes Service identity because witness endpoint changed;
12. application-specific recovery setting is overwritten by Control Center without ownership/provenance;
13. automatic Environment binding selects one correlated witness set without showing the dependency;
14. stale snapshot proposes itself as successor frontier after old anchor loss;
15. three witnesses share one compromised provider/account/control plane;
16. predecessor anchor unavailable is treated as predecessor contradicted;
17. destroyed predecessor is silently marked superseded;
18. successor anchor starts at generation 1 and thereby resets anti-rollback history;
19. majority witness vote discards a minority witness holding a later credential revocation;
20. fresh witness response carries an old frontier and is labeled current;
21. provider migration drops old negative evidence because the old provider is unreachable;
22. old provider returns after migration with a contradictory later frontier;
23. dual-witness overlap succeeds for payload but omits authority/negative-evidence dimensions;
24. recovery simulation PASS is reused as migration authority;
25. Factory-hosted witness is treated as proof of Factory ownership;
26. organizational successor lacks cryptographic predecessor but is silently rejected despite an explicit lawful re-bootstrap path;
27. cryptographic predecessor approves successor after losing organizational authority;
28. raw provider YAML/log checkpoint becomes desired state;
29. `OBSERVE_ONLY` integration receives mutation credentials while querying witness state;
30. witness digest leaks a rare tenant artifact through correlation/timing.

## 15. Proof obligations PO-351..PO-380

- **PO-351** Anchor identity is semantic and independent of provider endpoint/location.
- **PO-352** Every successor anchor identifies predecessor(s), protected claim classes and continuity/gap disposition.
- **PO-353** A restored state cannot be sole authority for increasing its own anti-rollback floor.
- **PO-354** At least one qualified anti-rollback basis lies outside the rollback domain being admitted, or the result is explicit re-bootstrap/UNKNOWN.
- **PO-355** Witness qualification records failure-domain/diversity assumptions, not count alone.
- **PO-356** Quorum result is claim-scoped and cannot become business consensus/ownership.
- **PO-357** `UNAVAILABLE`, `DESTROYED`, `COMPROMISED`, `CONTRADICTED`, `SUPERSEDED` remain distinguishable.
- **PO-358** Provider migration does not reset semantic anchor/frontier identity.
- **PO-359** Old negative evidence survives provider loss until qualified dominance/retirement is proven.
- **PO-360** Successor bootstrap carries per-dimension continuity/gap classification.
- **PO-361** Conflicting witnesses preserve contradiction; majority does not silently win absent declared policy.
- **PO-362** Witness-response freshness and frontier freshness are independently represented.
- **PO-363** Append-only/inclusion evidence is not normalized into non-equivocation or currentness proof.
- **PO-364** Monitoring/auditing evidence remains separate from log inclusion evidence.
- **PO-365** Witness commitments are Client/purpose scoped and exclude secret values.
- **PO-366** Cross-tenant shared witness infrastructure does not share authority/data semantics.
- **PO-367** Organizational authority for succession is requalified independently of cryptographic continuity.
- **PO-368** Factory-hosted witness does not grant Factory Client sovereignty.
- **PO-369** Simulation/preview evidence cannot activate anchor migration or restore authority.
- **PO-370** Application management mode is unchanged by anchor migration unless separately authorized.
- **PO-371** `EXTERNALLY_MANAGED`/`OBSERVE_ONLY` integrations never gain silent mutation authority through witness operations.
- **PO-372** Placement migration preserves Service semantic identity and separately proves old effect/fencing obligations.
- **PO-373** Provider artifacts/checkpoints remain evidence/projections, not canonical desired state.
- **PO-374** Automatic witness/anchor binding exposes provenance, diversity assumptions, currentness and consequences.
- **PO-375** Control Center configuration cannot collapse policy, applied provider state and effective qualified witness state.
- **PO-376** Global witness-policy changes produce blast-radius/requalification evidence before mutation and do not imply restart.
- **PO-377** Witness authentication credential currentness is independent of frontier currentness; secret values remain hidden.
- **PO-378** Window/session/pinned-surface lifecycle cannot alter anchor/witness/service lifecycle.
- **PO-379** Successor anchor cannot claim continuity merely by monotonically increasing a local/provider counter.
- **PO-380** Compaction/retirement proves all still-reachable recovery paths are dominated before predecessor negative evidence is discarded.

## 16. Contradictions / trade-offs

### Availability vs anti-rollback confidence

Requiring many independent witnesses improves correlated-compromise resistance but can make disaster recovery impossible when providers/jurisdictions fail together. The correct abstraction is an invariant-specific witness policy with explicit degraded/re-bootstrap outcomes, not an arbitrary global N.

### Privacy vs public transparency

Public transparency logs make omission/equivocation easier to detect but may leak tenant existence, timing or stable correlations. G4 therefore needs commitment/minimization and Client/purpose scoping rather than assuming public logging is universally safe.

### Provider-native fidelity vs portability

Provider logs/HSMs/immutable stores can provide stronger native evidence than a lowest-common-denominator adapter. G4 should preserve native evidence and use hybrid/deep-link integration where normalization would fabricate equivalence.

### Autonomous runtime vs witness currentness

Runtime autonomy means witnesses cannot be mandatory online dependencies for ordinary execution. Operations requiring rollback-resistant currentness may be blocked/degraded while ordinary autonomous runtime continues under its local bounded contracts.

## 17. Saturation assessment

- Web Desktop hierarchy / Window-session boundary: **HIGH conceptual saturation**.
- Application Manager lifecycle/management boundary: **MEDIUM-HIGH**.
- Control Center policy/config/provenance/change planning: **MEDIUM-HIGH**.
- Declarative deployment / placement identity: **MEDIUM-HIGH**.
- TemporalEvidenceFrontier / RecoverySafetyFrontier semantics: **MEDIUM-HIGH**.
- witness/anchor semantic identity and typed loss states: **MEDIUM-HIGH**.
- anchor succession / provider migration continuity: **MEDIUM**, material and not saturated.
- correlated-failure/diversity policy: **MEDIUM**, material and not saturated.
- privacy-preserving commitments: **MEDIUM-LOW**, not saturated.
- offline re-bootstrap after total witness loss: **MEDIUM-LOW**, not saturated.
- provider-native mapping: **EARLY-MATERIAL**.

No domain is declared fully saturated.

## 18. Next highest-value gap

**Total anchor/witness loss + successor re-bootstrap under incomplete frontier knowledge.**

The next round should determine what a Client can safely do when every configured witness/anchor is unavailable or destroyed, only historical recovery media survives, and organizational authority can be freshly established but semantic continuity cannot be fully proven. Key questions:

- what operations can be admitted in `REBOOTSTRAP_WITH_GAP` mode;
- how a new anti-rollback floor is established without claiming old completeness;
- how unresolved old credentials/effects/placements remain fenced or `UNKNOWN`;
- how later rediscovery of an old witness/frontier reconciles with the new epoch;
- whether independent claim classes can re-bootstrap separately;
- how to avoid permanent Factory dependence while preserving Client sovereignty.

Starting invariants:

`Fresh organizational authority != complete historical frontier`.

`Re-bootstrap != proven continuity`.

`New anchor floor != old negative evidence reconstructed`.

`Old witness rediscovered != new epoch automatically invalid`.

`Unknown predecessor effect != permission to recreate effect`.
