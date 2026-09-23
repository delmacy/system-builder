# G4 — Offline Autonomous Local Recontainment Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23

## Purpose

Consolidate the next transversal G4 Web Desktop & Application Environment gap: what a published autonomous runtime, managed service, external/BYOI target or locally resident control component may safely do when Factory/Control Center connectivity is unavailable and a locally observable dependency, authority, policy, credential, placement or trust condition degrades.

This is P&D documentation only. It does not implement product behavior, select providers, materialize WBS/Work Packages/Sprints/TASKs, or make the Control Center a runtime dependency.

Primary interface hypothesis remains:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

3D remains an optional projection/application, not a mandatory navigation substrate.

## Repository and predecessor constraints preserved

- `Builder != Runtime`; published runtimes remain autonomous.
- `Control plane unavailable != data plane must stop`.
- `Cached control-plane state != indefinitely current authority`.
- `Local containment != global ownership`.
- `Reconnect != effects settled`.
- `Window/session lifecycle != service lifecycle`.
- `Desired != Observed != Effective`.
- `Configured != Applied != Effective`.
- `SecretRef != secret value`.
- `Policy != configuration`.
- `Automatic != hidden`.
- `Adapter normalization != fabricated equivalence`.
- `Dependency graph != orchestration ownership`.
- `Shared dependency != shared authority`.
- `Provider ACK != effective state`.
- `UNKNOWN` is a qualified evidence disposition, never permission to guess.

This research follows the dynamic release-cohort/recontainment work: online orchestration already separates admission closure, drain, containment, effect settlement and release. The offline problem is not a second hidden Control Center; it is deciding which bounded safety actions must remain locally evaluable without acquiring broader semantic ownership.

## Inputs reconciled from concurrent G4 research

### Componentes conformance evidence provenance/retention

Recent :00 research establishes that evidence identity is revision/context bound, freshness is claim-specific and multi-horizon, retained provenance is not semantic correctness, and compaction may preserve a claim while raw artifacts age out. This matters offline: possession of an old local PASS or compacted evidence envelope does not make it currently admissible for a new effect.

### Emergency trust-governance recovery

Recent :10 research establishes that emergency recovery is a distinct, pre-bounded authority mode; out-of-band transport does not manufacture authority; emergency authority cannot silently become arbitrary business-effect authority; and successor trust installation does not imply full post-recovery qualification. Offline recontainment must obey the same principle: locally durable emergency/containment authority is narrower than ordinary business or management authority.

## External interaction-grammar evidence reviewed

1. Kubernetes Static Pods demonstrate that local supervision can continue without the API server: kubelet directly watches/restarts a static Pod and later mirrors state toward the API server. This is evidence for locally durable supervision without an online central oracle, not a recommendation to model SB runtimes as Kubernetes Static Pods.
2. AWS IoT Greengrass exposes local deployment/component operations through local IPC, but each operation requires an explicit authorization policy. This is evidence that local/offline-capable control can remain operation-scoped rather than becoming unrestricted device authority. AWS explicitly warns that its CLI component is intended for development rather than production, illustrating that local control surfaces can themselves enlarge attack surface.
3. HashiCorp Vault Agent/Proxy can cache tokens and leased secrets and can restore some leases from persistent cache. The cache can become stale when revocation happens outside the local proxy/agent. Restored cache is invalidated when its auto-auth token has expired. This is strong evidence that local possession is not perpetual currentness and that offline secret use requires explicit TTL/lease/floor semantics.
4. Vault leases force consumers to re-check periodically; expiration/revocation terminates renewal authority. This supports bounded local credential horizons rather than indefinite cached authority.

## F1 — Offline autonomy requires a locally durable contract, not a cached UI decision

Candidate durable object:

```text
LocalAutonomyContract
  contractId
  clientId
  environmentId
  subject/service/application scope
  contractRevision
  policy/securityFloorRefs[]
  authorityRevision
  admissibleOperationClasses[]
  localObservationClaims[]
  localContainmentActions[]
  continuationRules[]
  currentnessHorizons[]
  credential/leaseHorizons[]
  effect/fencingRequirements[]
  evidenceRequirements[]
  reconnectReconciliationRequirements[]
  expiry/retirement conditions
```

It is compiled/materialized from authoritative contracts into a runtime-consumable durable form, but remains a projection of named authority/policy revisions.

Invariants:

- `LOCAL_CONTRACT_PRESENT != LOCAL_CONTRACT_CURRENT`
- `LOCAL_CONTRACT != GLOBAL_POLICY_OWNER`
- `LOCAL_CONTRACT != MANAGEMENT_BINDING`
- `LOCAL_CONTRACT != SECRET_VALUE`
- `UI_CACHED_DECISION != LOCAL_AUTONOMY_CONTRACT`

## F2 — Offline behavior is operation/invariant scoped

Loss of Factory/Control Center connectivity does not produce one global mode.

Candidate operation classes:

```text
READ_EXISTING_STATE
SERVE_EXISTING_TRAFFIC
ACCEPT_NEW_TRAFFIC
LOCAL_DRAFT/EDIT
LOCAL_JOB_CONTINUATION
NEW_DATA_MUTATION
NEW_EXTERNAL_EFFECT
RETRY_EXISTING_OBLIGATION
ROTATE/RENEW_CREDENTIAL
LOCAL_RESTART
LOCAL_REDEPLOY
LOCAL_CONTAIN
LOCAL_RELEASE_FROM_CONTAINMENT
PLACEMENT_CHANGE
MANAGEMENT_HANDOFF
```

Each operation is independently `ALLOW_WITHIN_HORIZON`, `ALLOW_DEGRADED`, `QUEUE_WITHOUT_EFFECT`, `BLOCK`, `CONTAIN`, `REQUIRE_ONLINE_REQUALIFICATION`, or `UNKNOWN` under the exact protected invariant.

`OFFLINE != READ_ONLY` and `OFFLINE != FULLY_AUTONOMOUS`.

## F3 — Local containment authority should be monotone toward less effect, unless explicitly qualified otherwise

A useful default safety property is that a runtime may have broader authority to reduce exposure than to create new exposure.

Examples of candidate pre-authorized local actions:

- close new-effect admission for a named operation;
- remove local traffic eligibility;
- stop a local background producer;
- stop renewing a credential/lease where safe;
- fence a locally enforceable mutation scope;
- rate-limit a named local operation;
- preserve read/diagnostic access while blocking writes;
- emit durable evidence/incident records.

But even containment can be harmful: stopping a pump, database writer, safety process or quorum member can violate another invariant. Therefore:

`LESS_ACTIVITY != ALWAYS_SAFER`.

Local containment authority is valid only when the contract proves that the action is safe for the named invariant/dependency context.

## F4 — Local observation does not manufacture global facts

A runtime can observe local reachability, lease expiry, local process health, local queue depth, local dependency responses and locally enforceable fencing state. It cannot infer global settlement, global policy currentness or remote credential invalidation from absence of connectivity.

- `LOCAL_DEPENDENCY_UNREACHABLE != GLOBAL_DEPENDENCY_DOWN`
- `LOCAL_QUEUE_EMPTY != EXTERNAL_EFFECTS_SETTLED`
- `LOCAL_CREDENTIAL_REMOVED != REMOTE_CREDENTIAL_FENCED`
- `NO_LOCAL_TRAFFIC != NO_REMOTE_TRAFFIC`
- `FACTORY_UNREACHABLE != POLICY_REVOKED`

The local contract must name which claims are locally decidable and which become `UNKNOWN` while disconnected.

## F5 — Authority/currentness horizons are independent

Offline admissibility may depend on multiple clocks/floors:

```text
policyHorizon
authorityHorizon
securityFloorHorizon
trust/verifierHorizon
credentialLeaseHorizon
configurationHorizon
dependencyEvidenceHorizon
placementEvidenceHorizon
exception/waiverHorizon
```

One horizon expiring does not relabel all others, but can block operations that require it.

- `CREDENTIAL_VALID != POLICY_CURRENT`
- `POLICY_CURRENT != MANAGEMENT_AUTHORITY_CURRENT`
- `TRUST_RESOLVABLE != NEW_EFFECT_ADMISSIBLE`
- `LOCAL_CLOCK_ADVANCED != REVOCATION_OBSERVED`

Clock quality itself is part of evidence where expiry is security-relevant. A runtime with uncertain time cannot fabricate a still-valid TTL.

## F6 — Cached credentials are capabilities with bounded uncertainty, not convenience values

Vault evidence shows why persistent/local caching needs explicit disposition. A local cache may retain tokens/leases while being unaware of revocations performed elsewhere. Therefore candidate offline credential states include:

```text
VALID_WITHIN_OBSERVED_LEASE
RENEWAL_REQUIRED
RENEWAL_UNAVAILABLE
EXPIRED
REVOCATION_UNKNOWN
LOCALLY_FENCED
TARGET_FENCING_UNKNOWN
```

- `CACHED != VALID`
- `VALID_UNTIL_TTL != UNREVOKED_GLOBALLY`
- `CACHE_EVICTED != TARGET_CREDENTIAL_FENCED`
- `RENEWAL_FAILED != SECRET VALUE DISCLOSED`

`SecretRef` remains the durable binding identity; secret values never belong in Control Center diffs, Desktop Observatory, provenance summaries or reconciliation payloads.

## F7 — Local restart/recovery is distinct from semantic mutation

Kubernetes Static Pods provide evidence that local supervision can restart a failed process without central API availability. G4 should preserve the distinction:

`RESTART_SAME_QUALIFIED_ARTIFACT != UPGRADE`

`RESTART != REDEPLOY_NEW_REVISION`

`PROCESS_RECOVERED != SERVICE_EFFECTIVE_FOR_EVERY_INVARIANT`.

A local supervisor may be authorized to restore the same pinned qualified artifact/configuration while being forbidden to install a new version, change placement, adopt a discovered application or mutate policy.

## F8 — Offline install/adopt/upgrade should fail closed unless separately pre-authorized

Application Manager boundaries remain intact:

- `Install != Adopt`.
- `Register != Deploy`.
- `Discovered != Verified`.
- `Connect != Own`.

Discovery of a local process/service while offline cannot become adoption. An externally managed app cannot be silently upgraded because central management is unavailable. Co-management remains operation/field scoped.

Candidate default:

```text
DISCOVER -> observe locally
VERIFY -> only against locally resolvable qualified evidence
REGISTER/ADOPT/UPGRADE/UNINSTALL -> require explicit locally durable authority or online requalification
```

## F9 — Declarative service deployment needs an offline-stable semantic identity

The local runtime may retain compiled provider artifacts/manifests required to restart the same qualified deployment, but those artifacts do not become canonical intent.

- `PROVIDER_ARTIFACT_PRESENT != DESIRED_STATE_OWNER`
- `LOCAL_MANIFEST != CANONICAL_SERVICE_DEFINITION`
- `SERVICE_IDENTITY != RAW_IP`
- `DEPLOYMENT_UNIT != PHYSICAL_SERVER`

Offline restart/recovery preserves semantic Service identity and pinned deployment/configuration revisions. Placement migration is a new operation with independent authority/currentness and is not implied by failover unless the local contract explicitly defines an admissible placement set and fencing requirements.

## F10 — Local containment and local release are asymmetric

Containment can often be pre-authorized under a conservative safety contract; release from containment usually requires stronger evidence because it reopens effect admission.

`LOCAL_CONTAINMENT_AUTHORIZED != LOCAL_RELEASE_AUTHORIZED`.

A locally contained service may be released offline only if the durable contract names the exact surface/invariant, required local evidence, current horizons and residual-effect rules. Otherwise release waits for online requalification.

`DEPENDENCY LOOKS HEALTHY AGAIN != DEGRADED OBLIGATIONS SETTLED`.

## F11 — Reconnect begins reconciliation; it does not end it

Candidate reconnect sequence:

```text
CONNECTIVITY_RESTORED
 -> exchange immutable local/remote heads and evidence summaries
 -> qualify Client/Environment/authority/trust/currentness
 -> compare desired/config/policy/placement/management revisions
 -> enumerate local containment decisions and local effects
 -> enumerate remote changes/revocations
 -> classify conflicts/UNKNOWN
 -> reconcile per invariant/effect contract
 -> requalify admission/release
 -> compact/retain evidence according to policy
```

- `RECONNECTED != RECONCILED`
- `REMOTE_NEWER != REMOTE_SEMANTIC_WINNER`
- `LOCAL_CONTINUED_OPERATION != LOCAL_GLOBAL_AUTHORITY`
- `SYNC_COMPLETE != EFFECTS_SETTLED`

Historical local decisions remain attributable to the locally observed contract/evidence revision under which they occurred.

## F12 — Offline effect lineage must survive reconnection

Every local mutation/effect admitted while disconnected needs stable occurrence/effect identity and policy/authority basis.

Candidate envelope:

```text
OfflineEffectEnvelope
  occurrence/effectId
  client/environment
  operation/invariant
  localAutonomyContractRevision
  authority/policy/trust refs
  admissionEvidenceRefs[]
  attempts[]
  provider ACKs[]
  observed/effective/settlement disposition
  reconnectReconciliationRef?
```

`OFFLINE_RETRY != NEW_EFFECT`.

`UPLOAD_AFTER_RECONNECT != NEW_OCCURRENCE`.

`REMOTE_ACK_AFTER_RECONNECT != EFFECT_OCCURRED_AT_RECONNECT`.

## F13 — Offline evidence must be durable enough to prove restraint as well as action

Evidence is needed not only for actions performed but for safety boundaries applied locally: admission closed, credential renewal stopped, writes fenced, traffic removed, operation blocked due to expired horizon, or evidence downgraded to `UNKNOWN`.

Recent conformance-retention research is directly reusable: retain claim/provenance/currentness lineage independently from potentially large raw telemetry. However:

`LOCAL_LOG_PRESENT != AUTHORITATIVE_GLOBAL_TRUTH`.

`DIGEST/SIGNATURE != SEMANTIC_CORRECTNESS`.

`RAW_EVIDENCE_PRUNED != HISTORICAL_DECISION ERASED`.

## F14 — Local evidence stores require tenant and secret isolation

A runtime may serve one Client or multiple isolated Client contexts depending on deployment architecture. Offline evidence/cache identity must include Client/Environment and classification boundaries. Shared physical storage/provider infrastructure cannot imply shared data or authority.

- `SHARED_DISK != SHARED_TENANT`
- `SHARED_VAULT != SHARED_SECRET`
- `SHARED_PROVIDER != SHARED_AUTHORITY`
- `CACHE_KEY_WITHOUT_CLIENT_SCOPE = INVALID FOR TENANT-SENSITIVE CLAIMS`.

Sensitive raw artifacts follow retention/redaction policy; secret values are never required for a Control Center reconciliation claim when a reference/digest/disposition suffices.

## F15 — Control Center is a compiler/coordinator/observatory for offline contracts, not an online oracle

Candidate Control Center responsibilities:

- show which operations have offline autonomy and why;
- show exact policy/authority/currentness horizons;
- diff local-autonomy contract revisions;
- show local containment/release permissions separately;
- show dependency/evidence requirements and automatic bindings;
- calculate blast radius when changing offline policy;
- surface local decisions/effects after reconnect;
- show conflicts between application-specific advanced settings and global policy/config;
- preserve app/provider semantic ownership.

The runtime remains capable of evaluating its already-qualified local contract without Control Center availability.

`CONTROL_CENTER_COMPILED_RULE != CONTROL_CENTER_RUNTIME_DEPENDENCY`.

## F16 — Desktop Observatory and Pinned Monitoring Surfaces project offline state without owning it

Candidate visible dimensions:

```text
connectivity disposition
local autonomy contract revision/currentness
offline operation matrix
containment vector
credential/lease horizons
local evidence freshness
queued-without-effect obligations
inflight/UNKNOWN effects
reconciliation pending/conflicted
```

Closing/unpinning a surface cannot alter runtime containment or release.

`UI_CLOSE != SERVICE_STOP`.

`PINNED != AUTHORITATIVE`.

`GREEN_LOCAL_HEALTH != GLOBAL_ADMISSIBILITY`.

## F17 — External/BYOI and OBSERVE_ONLY targets remain externally owned offline

For `EXTERNALLY_MANAGED` and `OBSERVE_ONLY`, loss of Control Center does not expand SB authority. Local SB-side agents/adapters may observe, emit evidence, stop SB-originated new admissions, or apply only operations explicitly delegated to them.

- `CAN_OBSERVE_OFFLINE != CAN_MUTATE_EXTERNAL_TARGET`.
- `LOCAL_AGENT_INSTALLED != SB_OWNS_SERVICE`.
- `EXTERNAL_TARGET_UNREACHABLE != SB_MAY_REPLACE IT`.

For `CO_MANAGED`, offline permissions remain bounded to the exact fields/operations already delegated and may have shorter horizons than ordinary online authority.

## F18 — Automatic local binding must remain explainable

Environment defaults, generated service identity, network/storage/Vault bindings and placement profiles may be compiled automatically, but every locally consequential binding must expose:

- binding identity/revision;
- semantic owner;
- source/default/provenance;
- target Client/Environment/Service;
- authority/currentness horizon;
- local consequence if stale/unavailable;
- whether it can trigger containment, only block new admission, or is informational;
- whether online requalification is required.

`AUTOMATIC != HIDDEN`.

A hidden dependency that can shut down or reopen an autonomous runtime is an architectural defect.

## F19 — Raw-manifest escape hatches remain projections even offline

A raw provider manifest may be retained to reproduce/restart a pinned deployment or diagnose drift. Editing/importing it offline cannot silently replace typed canonical service intent.

Candidate dispositions for raw edits:

```text
DIAGNOSTIC_ONLY
PROPOSED_EXTERNAL_CHANGE
UNVERIFIED_EXTERNAL_DRIFT
REQUIRES_ADOPTION/REQUALIFICATION
```

`YAML_AVAILABLE != YAML_CANONICAL`.

## F20 — Local autonomy policy changes are high-blast-radius changes

Changing an offline horizon or locally permitted operation can alter behavior precisely when central observation is unavailable. Such changes therefore require explicit change planning/blast-radius analysis across Applications, Services, placements, credentials and dependencies.

Particularly sensitive changes:

- extending authority/policy TTLs;
- permitting new irreversible effects offline;
- permitting local release from quarantine;
- widening local credential renewal;
- permitting local upgrade/redeploy;
- changing clock/currentness assumptions;
- weakening security/trust floors.

`LONGER TTL != MORE CORRECT`.

`MORE AUTONOMY != MORE RESILIENCE FOR EVERY INVARIANT`.

## Required adversarial scenarios

1. Factory/Control Center disconnects while runtime is healthy: safe pre-qualified operations continue; no global stop is inferred.
2. Client A and B share physical infrastructure; A's offline policy/cache/evidence never authorizes B.
3. Restored Desktop/Workspace shows an old local-autonomy PASS: UI state cannot revive expired authority/currentness.
4. Local discovery finds an unregistered service: `Discovered != Verified`; no adoption occurs.
5. `EXTERNALLY_MANAGED` application has an available local binary update: SB does not silently upgrade it.
6. Global setting was changed remotely while runtime was offline: local runtime cannot know the change until reconciliation; reconnect does not retroactively rewrite local decisions.
7. Provider manifest exists locally after canonical typed config changed remotely: manifest does not become canonical truth.
8. User closes the Application/Observatory window during containment: runtime containment is unchanged.
9. Adapter reports provider `healthy` but cannot prove semantic compatibility: no fabricated equivalence.
10. Placement endpoint changes locally while semantic Service identity is stable: identity remains stable; placement authority/effect fencing are independently qualified.
11. Application-specific setting conflicts with locally cached Control Center contribution: precedence/provenance law is applied from pinned SettingContract; ambiguity degrades to conflict/UNKNOWN.
12. Automatic Vault binding exists but its lease/currentness rule is hidden from UI: conformance failure; automatic dependencies must be inspectable.
13. Vault Agent/Proxy cache retains a token while revocation happened directly at Vault: local cache cannot assert globally unrevoked; operations beyond allowed uncertainty block/contain.
14. Persistent cache restarts with expired auto-auth basis: stale cache cannot manufacture renewed authority.
15. Local clock becomes uncertain after long partition: expiry-sensitive new effects block rather than assuming time remains within horizon.
16. Dependency is locally unreachable but known redundant alternative remains contract-equivalent: only the named operation may use fallback; no global dependency failure is inferred.
17. Local restart restores the same pinned artifact: allowed if contract says so; upgrade to a newer artifact remains blocked.
18. Runtime detects policy horizon expiry while Control Center is unreachable: close only affected admission/effect scopes; preserve unrelated safe operation.
19. Local containment stops new traffic but existing connections/effects remain: containment cannot claim drain/settlement.
20. Connectivity returns while local and remote management revisions diverge: neither `latest timestamp` nor central location wins automatically.
21. Remote revocation occurred during partition and local effects were admitted under still-locally-valid evidence: historical local basis remains recorded; current reconciliation may classify/remediate without rewriting history.
22. Offline retry of an ambiguous payment/provisioning effect: stable effect identity is preserved; inability to prove retry safety blocks rather than creating a new effect.
23. `OBSERVE_ONLY` local agent sees severe drift: it may report/contain only SB-originated admissions explicitly delegated, never mutate target configuration by inference.
24. Raw YAML is edited during outage: edit is diagnostic/proposed drift, not canonical desired state.
25. Local evidence raw logs are pruned by retention policy: durable decision/provenance lineage remains, with reproducibility disposition degraded honestly.
26. Emergency trust recovery is available locally: recovery authority remains trust-governance scoped and cannot authorize arbitrary business effects.

## New invariants consolidated

- `Control Center unavailable != Runtime unsafe`.
- `Local autonomy != local sovereignty`.
- `Locally cached rule != indefinitely current authority`.
- `Local containment != global ownership`.
- `Local containment authority != local release authority`.
- `Reconnect != reconciliation != settlement`.
- `Local observation != global fact`.
- `Local process restart != semantic upgrade`.
- `Cached credential != globally unrevoked credential`.
- `Local manifest != canonical service intent`.
- `Offline retry != new effect`.
- `Less activity != always safer`.
- `Longer offline horizon != stronger resilience proof`.
- `Offline evidence retained != current admission authority`.
- `Shared local infrastructure != shared tenant/data/authority`.
- `Emergency recovery authority != ordinary business authority`.

## Proof obligations PO-231..PO-260

**PO-231** Every offline-admissible operation identifies Client, Environment, subject, operation, protected invariant and exact `LocalAutonomyContract` revision.

**PO-232** Local-autonomy contracts are durable enough for runtime evaluation but cannot become canonical policy/config/business ownership.

**PO-233** Every locally used policy/authority/security/trust/credential dependency has an explicit currentness horizon or a proof that no time/currentness horizon is material.

**PO-234** Expiry of one horizon invalidates only operations/claims that materially depend on it; unrelated safe operations are not globally stopped by inference.

**PO-235** Loss of Control Center connectivity alone neither grants nor revokes business/management authority.

**PO-236** Local containment actions are authorized per operation/invariant and prove they do not violate a stronger named invariant; `less activity` is not assumed safe.

**PO-237** Local release from containment has an independently qualified authority/evidence basis; prior containment authority is insufficient.

**PO-238** Locally observed health/reachability/queue state cannot be relabeled as global settlement, global policy currentness or remote fencing.

**PO-239** Every offline effect/retry preserves stable occurrence/effect identity and its historical admission basis through reconnection.

**PO-240** Reconnection preserves local and remote revision/effect histories and performs explicit reconciliation; timestamp recency cannot select semantic ownership.

**PO-241** Cached credential use distinguishes lease/TTL validity, renewal availability, revocation knowledge and target-side fencing; cache presence never proves all four.

**PO-242** Secret values never enter Control Center diffs, evidence summaries or reconciliation payloads where `SecretRef`/lease/binding dispositions suffice.

**PO-243** Local restart of a pinned qualified artifact is distinguishable from upgrade/redeploy/config mutation and does not fabricate new desired state.

**PO-244** Install/adopt/register/deploy/connect/own remain separate offline; discovery cannot grant adoption or management authority.

**PO-245** `EXTERNALLY_MANAGED` and `OBSERVE_ONLY` targets cannot gain SB mutation authority because the central control plane is unavailable.

**PO-246** `CO_MANAGED` offline mutations remain within the exact field/operation ownership and currentness bounds previously qualified.

**PO-247** Provider/raw manifests retained for recovery cannot become canonical service intent; semantic Service identity survives endpoint/placement changes.

**PO-248** Offline placement/failover actions preserve Service identity and require explicit admissible-placement plus old-effect/fencing proof where conflicting effects are possible.

**PO-249** Automatic environment/network/storage/Vault/placement bindings expose their identity, provenance, authority/currentness and local failure consequence.

**PO-250** Tenant-sensitive local caches/evidence include Client/Environment isolation in keys and authorization; shared physical infrastructure cannot collapse tenants.

**PO-251** Local evidence records actions, restraints and `UNKNOWN` dispositions with revision/currentness lineage sufficient for later reconciliation.

**PO-252** Evidence retention/compaction cannot relabel historical FAIL/PARTIAL/UNKNOWN or fabricate currentness when raw artifacts are pruned.

**PO-253** Clock uncertainty is explicit evidence for time-bounded authority; expiry-sensitive operations fail closed when remaining horizon cannot be proven.

**PO-254** Queue-without-effect is distinguishable from effect admission; reconnect delivery cannot silently become new business admission.

**PO-255** Dependency fallback is used offline only when contract equivalence for the required guarantee vector is locally provable; reachability alone is insufficient.

**PO-256** Local containment that stops new admissions does not claim drain, cancellation or settlement of already admitted/external effects.

**PO-257** Emergency trust-recovery authority remains independently scoped and cannot be reused as ordinary application/config/deployment authority.

**PO-258** Control Center projections explain offline autonomy/horizons/containment/reconciliation without becoming an online oracle required for safe autonomous operation.

**PO-259** Desktop/Window/Pin/session lifecycle cannot alter runtime containment, credential lifecycle, service lifecycle or effect settlement.

**PO-260** Changes that widen offline horizons or effect authority require explicit blast-radius/currentness/security review; availability pressure cannot silently weaken hard invariants.

## Cross-application architecture reconciliation

### Builder Home / Client tenancy / delegation

Offline contracts and evidence are Client-qualified. Builder Home may project fleet state but cannot reuse one Client's evidence/authority for another. Delegation is pinned by revision and operation scope.

### Workspace / Desktop / Window Manager

Workspace/Desktop state may preserve navigation and monitoring context. Recovery requalifies semantic context/currentness. Closing/restoring windows cannot alter runtime/service state.

### Application Portfolio / Application Manager

Portfolio discovery remains informational until verified/registered. Management mode and operation-specific authority survive disconnection; they do not widen because central coordination is absent.

### Control Center

Owns neither every setting nor every runtime decision. It authors/projects scoped config/policy/change plans and can compile qualified local-autonomy contracts. Application-specific advanced settings retain their semantic owner and declared precedence/provenance laws.

### Declarative Service Deployment

Typed service schemas remain canonical over provider YAML. Generated Service identity, network/storage/Vault bindings and Deployment Unit/placement-group semantics remain distinct from physical host identity. Offline restart may reuse pinned compiled artifacts; new deployment intent requires authority.

### Hosting / Placement

Shared managed, dedicated managed, external/BYOI and existing-service placement are profiles, not semantic Service identities. Offline failover/migration is permitted only when prequalified by invariant/fencing/currentness contract; otherwise it blocks or degrades.

### Vault / secrets

Local caches improve availability but introduce explicit stale-revocation uncertainty. Binding identity and lease/currentness are inspectable; secret values remain hidden.

### Desktop Observatory / Pinned Monitoring Surfaces

Project local/offline/currentness/reconciliation state. No green aggregate hides expired authority, stale credentials, unresolved effects or `UNKNOWN`.

### Proprietary editors / external tools

Editors may remain useful for local drafts/inspection under bounded offline semantics, but publish/new-effect authority follows the operation matrix. External tools participate through explicit adapters; adapter normalization cannot fabricate equivalence.

## Contradictions / trade-offs retained

1. **Autonomy vs revocation responsiveness.** Longer offline horizons improve availability but increase the interval in which remote revocation/policy change may be unknown.
2. **Persistent credential cache vs stale-revocation risk.** Local continuity improves while certainty about remote revocation can degrade.
3. **Fail-closed vs operational safety.** Stopping activity may itself violate availability/safety invariants; containment must be operation/invariant specific.
4. **Local restart resilience vs configuration drift.** Restarting a pinned artifact is safer than upgrading, but may preserve an old configuration that is no longer globally desired.
5. **Rich reconciliation evidence vs privacy/retention.** Enough lineage must survive for audit/reconciliation without retaining secrets or unnecessary client data.
6. **Local emergency recovery vs latent super-root risk.** Survivable recovery requires durable authority but that authority must remain narrow, time/scope bounded and retired after use.

No contradiction justifies collapsing desired/observed/effective, policy/configuration, SecretRef/value, UI/runtime lifecycle, or management modes.

## Maturity / saturation

- Offline autonomy as locally durable operation/invariant-scoped contract: `ADVANCED_EMERGING / MATERIAL`.
- Independent authority/currentness/security/credential horizons: `ADVANCED_EMERGING / MATERIAL`.
- Local containment vs local release asymmetry: `MATERIAL / NOT_SATURATED`.
- Offline effect lineage + reconnect reconciliation: `MATERIAL / NOT_SATURATED`.
- Vault/local credential stale-revocation semantics: `MATERIAL / NOT_SATURATED`.
- External/BYOI/observe-only offline authority boundary: `ADVANCED_EMERGING`.
- Provider-native offline deployment/failover mapping: `EARLY_MATERIAL`.
- Clock-quality/currentness behavior under long partition: `EARLY_MATERIAL`.

No domain is declared saturated.

## Next highest-value gap

**Offline authority horizon exhaustion + asymmetric reconnect/revocation races.**

The next round should study the hard interval where a runtime's local authority/policy/credential horizon is about to expire or has expired, while connectivity is intermittent and remote state may contain revocation, policy supersession, management handoff or placement changes. It should determine:

- grace/no-grace semantics by operation and invariant;
- whether renewal may extend only existing obligations or admit new effects;
- how to handle reconnect that succeeds long enough to fetch some but not all currentness domains;
- monotonic local security/authority floors across restart;
- revocation-effective-time vs observation-time vs local-effect-time;
- safe handling of remote policy/authority changes received after locally admitted effects;
- prevention of oscillation between online/offline admission;
- proof requirements for resuming locally contained scopes;
- preservation of historical local authority basis without treating it as current authority.

Key invariants to preserve next:

`Partial reconnect != full requalification`; `Lease renewed != policy current`; `Remote revocation learned late != historical local effect erased`; `Grace period != hidden policy weakening`; `Connectivity flap != authority flap`; `Observed newer state != all dependency domains current`.
