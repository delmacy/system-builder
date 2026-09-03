# Developer / Operator Experience / Self-hosting — Revisit 04

Status: REVISIT 04 / CYCLE 5 — MATERIAL NEW FINDINGS — NOT SATURATED

## Research question
What evidence and authority contracts let a self-hosted System Builder remain easy to install and operate while making update provenance, ambiguous maintenance outcomes, recovery, diagnostics, disconnected operation and fleet delegation safe enough for enterprise use without turning physical/local control into semantic or administrative authority?

This revisit deepens Revisit 03 rather than repeating its simple-to-mature topology work. Focus: secure offline update lineage; attempted/effective/healthy maintenance state; reconcile-before-retry; restore closure; support-bundle custody; break-glass; fleet targeting; reconnection requalification; and AI/AGWS boundaries.

## Evidence / source ledger

1. **The Update Framework (TUF) Specification 1.0.36, 2026-08-05** — signed root/targets/snapshot/timestamp roles, threshold trust, expiration, rollback/freeze/mix-and-match resistance, persistent trusted metadata, delegated trust and mirror independence. Official specification: https://theupdateframework.github.io/specification/latest/
2. **OpenShift disconnected environments / oc-mirror 4.20–4.21** — disconnected update graph/material, release-image signatures, Sigstore signature mirroring, local registries, explicit digest/update prerequisites and operator lifecycle considerations. Official Red Hat documentation: https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html-single/disconnected_environments/index
3. **Rancher Fleet** — Git-backed multi-cluster targets, cluster groups/selectors, ordered rollout partitions, readiness-gated progression, `maxUnavailable`, offline clusters remaining NotReady, and per-target customization. Official docs: https://fleet.rancher.io/how-tos-for-users/rollout and https://fleet.rancher.io/how-tos-for-users/gitrepo-targets
4. **GitLab Self-Managed backup/restore** — backup data excludes critical configuration/secrets; restore requires compatible version/configuration, separate secrets, storage assumptions and ordered incremental backup chain. Official docs: https://docs.gitlab.com/administration/backup_restore/backup_gitlab/ and https://docs.gitlab.com/administration/backup_restore/restore_gitlab/
5. **Talos Linux evidence from Revisit 03 remains authoritative** for immutable/API-driven realization, scoped PKI, local support bundles, A/B-style upgrade/rollback and local operational autonomy. This revisit uses that evidence to cross-check diagnostic/recovery authority, without claiming new representative coverage.
6. **NixOS/OpenShift/Kubernetes evidence from Revisit 03 remains authoritative** for preview/preflight, retained rollback material, bootstrap trust and privileged diagnostics.

## Evidence-derived primitives

### 1. Update trust is a revision vector, not a signed-file boolean
A disconnected update should be identified by a qualified vector such as:

`UpdateIntentRevision → TargetArtifactDigest → MetadataRootRevision → Snapshot/TimestampRevision → Signature/ThresholdPolicyRevision → MirrorClosureRevision → UpdateGraphRevision → Attempt → EffectiveRevision → Health/PostconditionEvidence`.

TUF shows why freshness, rollback resistance and mix-and-match resistance require persistent trusted metadata and coordinated versions, not merely a valid signature on a payload. OpenShift shows that disconnected release integrity also depends on mirrored signatures/digests and update-path material.

### 2. Self-hosted maintenance needs attempted/effective/healthy separation
Operator commands are requests, not truth. Bootstrap, upgrade, rollback, restore, mirror sync or fleet rollout must preserve at least:

`REQUESTED → ATTEMPTED → ACKNOWLEDGED? → EFFECTIVE? → HEALTHY/VALIDATED?`.

A lost acknowledgement or partial fleet rollout cannot be collapsed into FAILURE or SUCCESS. The safe state is `OUTCOME_UNKNOWN`/`PARTIAL` until external/effective state is reconciled.

### 3. Mirror presence is not mirror qualification
An air-gapped mirror is usable only when its content identity, metadata/signature set, update graph/path, freshness policy and trust root satisfy the target operational profile. A reachable local registry with stale or mixed metadata is not equivalent to an eligible update source.

### 4. Recovery closure is multi-material
GitLab demonstrates that data archives alone can be insufficient: secrets, encryption keys, configuration, compatible software version/storage shape and incremental-chain continuity can determine restorability. Therefore self-hosted recovery closure includes data + config + trust/secrets references + binaries/artifacts + migration interpreters + topology/storage assumptions + ordered lineage necessary to reproduce a valid state.

### 5. Diagnostics evidence and diagnostic authority are distinct
A support bundle may be exportable and shareable while privileged host inspection, secret retrieval, process attachment, node mutation or recovery remain denied. Support evidence should carry provenance, sensitivity classification, redaction status, source revision and custody/transfer lineage.

### 6. Fleet targeting is an authority-bearing scope decision
Fleet shows that cluster selectors/groups and rollout partitions determine which targets receive a change. In SB semantics, target selection is not merely UX filtering: it must be constrained by Enterprise → Station delegation, exact operational scope, revision and actuation authority. A Station operator may manage its delegated targets without acquiring authority over sibling Stations or Enterprise-global topology.

### 7. Reconnection requalifies, it does not silently merge
Offline/local operation may continue under a declared closure and bounded authority. On reconnection, remote policy/trust/provider/config/update metadata may have advanced. Local effective state remains evidence, but readiness/approval/update/authority evidence that depended on stale remote revisions must be requalified before new privileged actuation.

## Source of truth / identity
Canonical ownership remains semantic:

- `OperationalProfileRevision`
- `TopologyRequirementRevision`
- `UpdatePolicyRevision`
- `BootstrapTrustRequirementRevision`
- `RecoveryClosureRequirementRevision`
- `FleetTargetScopeRevision`
- `DiagnosticEvidencePolicyRevision`

Provider-specific installers, mirrors, cluster labels, Git repos, backup commands and dashboards are realizations. They do not become System/Station/capability identity.

## Lifecycle / versioning
1. Resolve operational/topology/update/recovery profile.
2. Resolve bootstrap/update/recovery closure and exact trust roots/policies.
3. Qualify mirror/update graph/signature metadata or connected provider.
4. Resolve target scope and delegated authority.
5. Preview/preflight where supported; bind evidence to exact revision vector.
6. Actuate one transition attempt.
7. Reconcile effective state when acknowledgement is absent/partial/ambiguous.
8. Qualify health/domain postconditions independently of command success.
9. Persist resulting effective revision, diagnostics and rollback/recovery eligibility.
10. On offline reconnection or provider/topology change, invalidate dependent stale evidence and requalify before further privileged acts.

## Failure semantics
- `SIGNED` but expired/rollback/mix-and-match-inconsistent metadata => **NOT QUALIFIED**.
- Local mirror reachable but missing required graph/signature/history material => **INCOMPLETE/INCONCLUSIVE**.
- Upgrade request acknowledged but effective revision unknown => **OUTCOME_UNKNOWN**, reconcile before retry.
- Fleet rollout with offline/not-ready subset => **PARTIAL**, never global SUCCESS.
- Restore archive present but secrets/config/version/storage/incremental-chain prerequisite missing => **RECOVERY_NOT_READY/INCONCLUSIVE**.
- Support bundle generated without redaction/custody qualification => evidence may exist but **NOT SHARE-READY**.
- Break-glass without exact scope, lease/expiry, reason, audit and post-use requalification => **DENIED**.
- Reconnected node/fleet with stale policy/trust/update metadata => continued observation may be allowed, but new privileged transitions require requalification.

## Extensibility / provider boundaries
Installer, orchestrator, update repository, mirror transport, fleet controller, backup mechanism and diagnostic collector are providerized. Provider substitution is accepted only when the same operational requirements can be re-proven with new realization evidence.

TUF is especially useful as a boundary example: it secures obtaining trusted update targets but explicitly does not define the application-specific installation action. SB should similarly separate update-source qualification from provider-specific mutation.

## Governance / authority
Preserve faceted authority:

`Observe ≠ ExportDiagnostics ≠ Preview ≠ Bootstrap ≠ Configure ≠ Update ≠ Rollback ≠ Restore ≠ FleetTarget ≠ TrustAdmin ≠ SecretAccess ≠ BreakGlass`.

Physical possession of a self-hosted machine does not create canonical authority. Delegation is bounded by `Enterprise → Station → Role → Person`, exact target scope and operation facet. Break-glass is an exceptional, explicit, time/scope-bounded authority lease with audit and post-use requalification; it is not a permanent local-admin bypass.

AI/AGWS may present diagnostics, propose transitions and prepare bounded artifacts. They cannot convert a support bundle, shell access, discovered tool, local root access or human approval into undelegated topology/trust/recovery authority.

## Observability
Operational evidence should expose:
- requested/attempted/effective/healthy revisions separately;
- exact mirror/update/signature/root/graph revisions;
- target/fleet scope and per-target outcome;
- `PARTIAL`, `OUTCOME_UNKNOWN`, `INCONCLUSIVE` as first-class states;
- recovery-closure qualification and missing prerequisites;
- support-bundle provenance/redaction/custody;
- offline duration, last trusted remote policy/trust revision and reconnection requalification status.

## Portability / lock-in
Self-host portability requires exportable update/recovery closure and evidence, not just portable container images. Lock-in remains if safe upgrade, rollback, restore, trust recovery, diagnostics or fleet targeting requires opaque vendor state that cannot be exported/reconstructed.

Provider-specific update graphs or metadata services are acceptable when their dependency is explicit, locally satisfiable where required and replaceable through a defined provider boundary.

## Product-specific mechanism vs universal primitive
| Product mechanism | Universal primitive |
|---|---|
| TUF root/targets/snapshot/timestamp metadata | revisioned update trust/freshness/consistency qualification |
| TUF delegated roles and threshold signatures | bounded trust delegation + compromise-resistant update authority |
| OpenShift release signature + mirrored graph/images | disconnected update closure + provenance/path qualification |
| Fleet target selectors / rollout partitions | authority-scoped target set + staged rollout/readiness evidence |
| GitLab backup + separate secrets/config | multi-material recovery closure |
| GitLab exact-version restore prerequisite | recovery compatibility/postcondition qualification |
| Talos support bundle | locally exportable diagnostic evidence under custody policy |

## Convergent / divergent patterns
### Convergent
1. Safe update requires trusted/fresh metadata and exact target identity, not transport security alone.
2. Offline autonomy requires explicit local closure and history.
3. Fleet rollout success is per-target and readiness-qualified.
4. Recovery depends on more than data bytes.
5. Diagnostics are useful evidence but can cross privilege/sensitivity boundaries.
6. Provider/local operation must not erase semantic authority boundaries.

### Divergent
- TUF deliberately stops before installation semantics; OpenShift couples update qualification to a concrete cluster lifecycle. SB should retain the separation.
- Fleet centralizes desired rollout coordination; disconnected nodes may be temporarily unreachable. SB must preserve local evidence/authority without pretending global convergence.
- GitLab recovery is application-specific and version-coupled; immutable/generative systems may recover differently. The universal primitive is qualified recovery closure, not GitLab's restore sequence.

## Reconciliation hypotheses
- **HARDEN** self-hosted maintenance into explicit attempted/effective/healthy lineage with `PARTIAL/OUTCOME_UNKNOWN`.
- **GENERALIZE** update-source/mirror qualification into revision-bound trust + freshness + consistency evidence.
- **GENERALIZE** recovery closure as multi-material and compatibility-qualified, shared with Security/Lifecycle/Secrets/Data.
- **INTEGRATE** fleet target scope with Authorization, Station delegation, Deployment and Provider Binding.
- **PROVIDERIZE** update/mirror/fleet/backup/diagnostic mechanisms while preserving semantic requirements.
- **KEEP** local diagnostic export, but separate evidence custody from privileged debugging.
- **HARDEN** offline reconnection into mandatory dependent-evidence requalification.
- **DO_NOT_BUILD** a self-host mode where root/shell possession silently implies canonical, trust, recovery or fleet authority.

## Repo-validation questions
1. Can maintenance state represent requested, attempted, effective and healthy revisions separately?
2. Is there an explicit `OUTCOME_UNKNOWN`/reconcile-before-retry path for host/provider operations with lost acknowledgement?
3. Can offline update closure encode exact root/signature/metadata/update-graph freshness rather than only artifact presence?
4. Can restore readiness prove data, config, secret/trust references, compatible runtime/migration material and ordered backup lineage?
5. Are support bundles sensitivity-classified/redacted with provenance and custody separate from host-debug authority?
6. Can Enterprise delegate exact fleet/Station target scopes and operation facets without sibling/global authority leakage?
7. Is break-glass represented as scoped/expiring audited authority with post-use requalification?
8. Does reconnection invalidate stale policy/trust/update approvals before new privileged operation?
9. Can provider replacement preserve System/Station semantic identity while regenerating operational evidence?
10. Can AGWS/AI propose recovery/update actions while hard enforcement independently denies undelegated actuation?

## Architecture proof-backfill — cycle 5 additions
1. **Ambiguous maintenance proof:** external update succeeds but acknowledgement is lost; repeated blind actuation must be blocked until effective revision is reconciled.
2. **TUF-style stale/mix-and-match proof:** provide correctly signed but stale or inconsistent metadata set; update must be rejected/INCONCLUSIVE despite payload availability.
3. **Disconnected mirror qualification proof:** mirror all target bytes but omit required signature/graph/history material; maintenance must not become READY.
4. **Partial fleet proof:** stage a change to multiple Stations with one offline/not-ready target; global result remains PARTIAL and unaffected targets retain exact outcome lineage.
5. **Recovery closure proof:** present valid data backup while withholding secret/config/version-chain prerequisite; restore readiness must fail before destructive actuation.
6. **Diagnostic custody proof:** generate support evidence containing sensitive material; ordinary Station support role may export only after policy-compliant redaction/custody qualification and never receives host/secret authority implicitly.
7. **Break-glass non-amplification proof:** activate scoped emergency recovery lease; attempts outside target/operation/time scope remain denied and authority is requalified/revoked after closure.
8. **Reconnection proof:** operate offline under valid local closure, advance remote policy/trust revision, reconnect and prove old privileged readiness/approval evidence becomes stale before next actuation.
9. **Provider substitution proof:** replace mirror/fleet/backup provider while preserving canonical operational requirements and reissuing conformance/effective evidence.
10. **AI/AGWS boundary proof:** give AI full diagnostics plus local tool discovery; it may propose but cannot obtain trust-admin, fleet-target, secret, restore or break-glass authority from context or human convenience approval.

## Symbiotic Proof
Operate one semantic system across two Stations and two materially different operational providers. Station A stays connected; Station B runs disconnected from a qualified local closure. Mirror a signed target set but intentionally mix stale metadata into Station B and prove update rejection despite payload presence. Repair the metadata, issue a scoped rollout, then lose acknowledgement after one provider applies the change; require reconciliation rather than retry.

Next, take one Station offline during fleet rollout and prove global `PARTIAL`, not SUCCESS. Restore from a data-valid backup while withholding one required secret/config/version-chain prerequisite and prove recovery is not READY. Generate a support bundle and prove redaction/custody without granting privileged debug. Exercise scoped break-glass recovery and prove no authority leaks to sibling Station, Role, Person, AGWS or AI. Finally reconnect the disconnected Station after remote policy/trust changes and require requalification before further privileged mutation.

## Stable findings
- **G2-FINDING-DOESH-31 — Self-hosted Update Eligibility Requires a Revision-bound Trust/Freshness/Consistency Vector, Not Merely Signed or Present Artifacts.** TUF and disconnected OpenShift evidence show root/signature, timestamp/snapshot consistency, artifact digest, update path and mirror closure are separable qualifications.
- **G2-FINDING-DOESH-32 — Maintenance Intent, Attempt, Effective Realization and Healthy/Validated State Are Distinct Evidence Facts; Ambiguous Outcomes Require Reconciliation Before Retry.** Provider acknowledgement is not authoritative state.
- **G2-FINDING-DOESH-33 — An Offline Mirror Is Operationally Eligible Only When Its Artifact, Trust Metadata, Update-path/graph, History and Freshness Satisfy the Declared Profile.** Reachability or byte presence alone is insufficient.
- **G2-FINDING-DOESH-34 — Self-hosted Recovery Closure Is Multi-material and Compatibility-qualified.** Data, configuration, secrets/trust, software/migration versions, storage/topology assumptions and ordered backup lineage may all determine restorability.
- **G2-FINDING-DOESH-35 — Diagnostic Evidence Custody/Redaction and Privileged Diagnostic Actuation Are Separate Authorities.** Exportability must not silently expose host, secret or recovery powers.
- **G2-FINDING-DOESH-36 — Fleet Target Selection and Rollout Scope Are Authority-bearing Semantic Decisions, Not Mere Operator Filtering.** Delegation must remain bounded by Enterprise → Station and exact operation/target scope.
- **G2-FINDING-DOESH-37 — Break-glass for Self-hosted Recovery Must Be a Scoped, Expiring, Audited Authority Lease With Post-use Requalification.** Local/root access is not a constitutional bypass.
- **G2-FINDING-DOESH-38 — Offline-to-connected Transition Requires Requalification of Evidence Whose Policy, Trust, Provider or Update Dependencies May Have Advanced.** Local effective state remains evidence, but stale privileged readiness cannot silently survive reconnection.

## Capability candidates
| Candidate | Class | Status | Promotion / merge condition |
|---|---|---|---|
| `G2-CAPABILITY-CANDIDATE-DOESH-QUALIFIED-OFFLINE-UPDATE-SOURCE` | CROSS_CUTTING | CONSOLIDATION_CANDIDATE | Reconcile with Artifact provenance, Secrets/trust, Lifecycle readiness and Provider Binding without losing update freshness/consistency semantics. |
| `G2-CAPABILITY-CANDIDATE-DOESH-MULTI-MATERIAL-RECOVERY-CLOSURE` | CROSS_CUTTING | CONSOLIDATION_CANDIDATE | Merge with Security/Recovery qualified local closure if data/config/trust/version-chain completeness remains explicit. |
| `G2-CAPABILITY-CANDIDATE-DOESH-DIAGNOSTIC-EVIDENCE-CUSTODY` | CROSS_CUTTING | CANDIDATE | Reconcile with Observability/Governance evidence handling while preserving separation from privileged diagnostic actuation. |
| `G2-CAPABILITY-CANDIDATE-DOESH-AUTHORITY-SCOPED-FLEET-ROLLOUT` | CROSS_CUTTING | CONSOLIDATION_CANDIDATE | Reconcile with Tenant/Fleet hypothesis, Deployment and Authorization; do not promote as duplicate fleet engine. |

No candidate is promoted in this revisit.

## Saturation assessment
Principal representative coverage is deep and the capability now has explicit architecture proofs, but eight material findings were added. `consecutive_no_material_finding = 0`; therefore **NOT SATURATED**. Future revisit should test whether these primitives consolidate cleanly with Security/Recovery, Lifecycle, Artifact/Provenance, Authorization and Tenant/Fleet without producing new semantic owners.
