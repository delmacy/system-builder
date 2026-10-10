# G4 — Web Desktop Mixed-Management Authority Provider Migration Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22
Scope: G4 Web Desktop & Application Environment — Application Manager / Control Center / deployment / provider migration / adopted and imported resources

## Purpose

Deep-gap continuation of `G4_WEB_DESKTOP_PROVIDER_COMPILATION_CONFORMANCE_PORTABILITY_RESEARCH.md`. This round studies provider upgrade/migration when one blast radius contains SB-managed, externally-managed, observe-only and co-managed resources, including imported/adopted state, identity handoff, partial migration, rollback, retirement and effects already in flight.

This is P&D documentation only. It does not authorize implementation, WBS, Work Packages, Sprints, TASKs, provider adoption, migration execution or product changes.

## Repository inputs reconciled

The current G4 corpus already establishes:

- `Install != Adopt`, `Register != Deploy`, `Discovered != Verified`;
- `Desired != Observed != Effective` and `ACK != effect`;
- management authority is distinct from visibility and configuration precedence;
- Control Center coordinates without becoming the semantic owner of every target;
- provider compilation is a proof-carrying derivation, not serialization;
- provider/API/version/opaque-extension facts participate in qualification;
- Workspace/Window lifecycle never becomes runtime or provider authority;
- effect verification is claim-specific and contradictions remain explicit;
- configuration ownership may be `SB_OWNED`, `EXTERNAL_OWNED`, `SHARED_WITH_MERGE_LAW`, `OBSERVED_ONLY`, `POLICY_CONSTRAINED`, `PROVIDER_DERIVED` or unknown.

This round therefore does not reopen generic provider compilation or configuration inheritance. It addresses authority continuity during migration.

## External evidence reviewed

Pattern evidence only; no adoption decision is implied.

### OpenTofu / Terraform state identity and management handoff

OpenTofu/Terraform associate a real object with a configured resource address. Moving a resource, removing it from state without destroying it, importing it elsewhere, and replacing a provider are explicit state operations. OpenTofu warns that one remote object should be bound to only one managed resource address; duplicate import can cause unwanted behavior. `state replace-provider` requires a backup and warns that disabling locking is dangerous.

Portable lessons:

- object identity and manager/state identity are separate;
- provider replacement is an explicit management transition;
- old-manager detachment and new-manager attachment cannot be inferred from matching configuration;
- duplicate active management of one effectful object is hazardous unless a declared co-management law exists;
- rollback requires more than restoring UI/provider configuration: state identity and external effects matter.

### Crossplane imported/observe-only resources

Crossplane supports importing an existing external resource first under an `Observe` management policy. Management policies separately express Create, Delete, LateInitialize, Observe and Update, and provider support is itself provider-specific.

Portable lessons:

- `IMPORTED != MUTATION_AUTHORIZED`;
- observation can precede adoption safely;
- authority is operation-dimensional rather than a single managed/unmanaged boolean;
- provider capability qualification remains part of authority qualification.

### Kubernetes Server-Side Apply field managers

Server-Side Apply tracks field ownership by manager and exposes conflicts when actors contend for fields. Force-conflicts can deliberately acquire ownership; ownership is not silently normalized by object identity.

Portable lesson: co-management can be field/operation scoped, and conflict/transfer is a first-class event rather than last-writer-wins convenience.

## Core finding — provider migration is an authority handoff over a resource set, not a provider-name substitution

Candidate model:

```text
ManagementSubject
  semanticResourceRef
  externalObjectIdentityRef
  providerStateIdentityRef?
  currentManagers[]
  authorityVector
  ownershipScope
  evidenceCurrentness
  inFlightEffects[]
```

Candidate authority vector:

```text
OBSERVE
CREATE
UPDATE
DELETE
ROTATE_SECRET
RESTART_RELOAD
SCALE
MOVE_REPLACE
IMPORT_ATTACH
DETACH_FORGET
```

Not every resource or manager possesses every dimension.

```text
CAN_OBSERVE != CAN_UPDATE
CAN_UPDATE != CAN_DELETE
IMPORTED != ADOPTED
ADOPTED != EXCLUSIVE_MANAGER
SAME_EXTERNAL_OBJECT != SAME_PROVIDER_STATE_IDENTITY
```

A migration plan must reason over each material authority dimension and resource/field scope.

## Management dispositions

Candidate per-subject disposition:

```text
SB_EXCLUSIVE
EXTERNAL_EXCLUSIVE
OBSERVE_ONLY
CO_MANAGED_DISJOINT_SCOPE
CO_MANAGED_DECLARED_MERGE
HANDOFF_SOURCE
HANDOFF_TARGET_READONLY
HANDOFF_TARGET_QUALIFIED
DUAL_MUTATION_SUSPECTED
UNOWNED_GAP
UNKNOWN_AUTHORITY
```

`CO_MANAGED` is not permission to let two providers mutate the same field/effect domain arbitrarily. It requires a declared disjoint-scope or merge law.

## Imported/adopted lifecycle

Candidate lifecycle:

```text
DISCOVERED
 -> IDENTITY_QUALIFYING
 -> IMPORT_CANDIDATE
 -> OBSERVE_ONLY_ATTACHED
 -> BASELINE_RECONCILING
 -> ADOPTION_PROPOSED
 -> AUTHORITY_IMPACT_PREVIEWED
 -> ADOPTION_DESIRED
 -> MUTATION_AUTHORITY_QUALIFYING
 -> ADOPTED_PARTIAL | ADOPTED_EFFECTIVE | ADOPTION_BLOCKED
```

Rules:

- discovery supplies a candidate identity, not management authority;
- import/attach establishes tracking/observation only to the extent proven;
- baseline reconciliation compares desired/configured/observed state before mutation rights are enabled;
- provider-derived/late-initialized values retain provenance and do not silently become authored desired values;
- adoption may remain partial by operation or field scope.

## Migration protocol — target qualification before source retirement

Candidate migration envelope:

```text
MIGRATION_PROPOSED
 -> SUBJECT_SET_QUALIFIED
 -> SOURCE_AUTHORITY_SNAPSHOTTED
 -> TARGET_PROVIDER_CAPABILITY_QUALIFIED
 -> IDENTITY_MAPPING_QUALIFIED
 -> TARGET_ATTACHED_NON_MUTATING
 -> TARGET_OBSERVATION_RECONCILED
 -> HANDOFF_PLAN_CONFIRMED
 -> SOURCE_MUTATION_FREEZE_REQUESTED
 -> SOURCE_FENCE_VERIFICATION
 -> TARGET_MUTATION_AUTHORITY_ENABLED
 -> EFFECT_VERIFICATION
 -> SOURCE_DETACH_ELIGIBLE
 -> SOURCE_RETIRED
 -> SETTLED
```

This is deliberately not a global transaction. Different subjects may settle independently, but aggregate status must preserve every exception.

```text
TARGET ATTACHED != TARGET AUTHORIZED
SOURCE FREEZE ACK != SOURCE FENCED
TARGET ENABLED != EFFECTIVE OWNER
SOURCE DETACHED != OLD EFFECTS SETTLED
MIGRATION 99% COMPLETE != SAFE TO HIDE 1% UNKNOWN
```

## Two-provider overlap is a bounded transition state, not normal equivalence

A safe migration may require both providers to observe the same object temporarily. Observation overlap is not mutation overlap.

Candidate overlap dispositions:

```text
DUAL_OBSERVE_SAFE
SOURCE_MUTATE_TARGET_OBSERVE
SOURCE_FENCED_TARGET_PENDING
TARGET_MUTATE_SOURCE_OBSERVE
DISJOINT_CO_MANAGEMENT
DUAL_MUTATION_DECLARED_SAFE
DUAL_MUTATION_UNSAFE
UNKNOWN
```

Default proof posture: if both providers can issue conflicting effects over the same scope and no merge/fencing law is proven, disposition is `DUAL_MUTATION_UNSAFE`.

## Fencing must be proven at the effect boundary where possible

Disabling a controller, deleting credentials or changing a provider configuration may be useful operational actions, but none alone proves old effect authority is gone.

Candidate fence evidence:

```text
SourceFenceEvidence
  managerRef
  subjectRef
  authorityDimension
  scope
  mechanism
  enforcedAt
  verificationSource
  currentness
  limitations[]
```

For an externally enforced API credential revocation, target-side rejection may provide stronger evidence than local controller shutdown. For non-fenceable effects, the migration must retain overlap/settlement obligations explicitly.

`CONTROLLER STOPPED != OLD CREDENTIAL REVOKED != TARGET REJECTS OLD AUTHORITY`.

## In-flight effects survive manager migration

Effects submitted before handoff keep their original occurrence/effect identity and verification contract.

```text
MIGRATION != RETRY
MIGRATION != COMPENSATION
MANAGER CHANGED != OCCURRENCE RE-OWNED
```

An old provider may have submitted an operation whose ACK/effect arrives after the new provider becomes manager. The new manager must correlate and reconcile that occurrence rather than treating it as unexplained drift or silently repeating it.

Candidate lineage:

```text
EffectOccurrence
  submittedByManagerRef
  providerGenerationRef
  subjectRef
  effectIdentity
  migrationEpochRef?
  status
  verificationObligation
```

Source retirement is blocked or qualified while material unresolved effects remain unless their verification obligation is durably transferred without changing historical origin.

## Partial migration and rollback

A blast radius may contain subjects in different dispositions:

```text
A -> TARGET_EFFECTIVE
B -> TARGET_OBSERVE_ONLY
C -> SOURCE_STILL_EFFECTIVE
D -> DUAL_MUTATION_UNSAFE
E -> UNKNOWN_EFFECT
```

Aggregate presentation must expose counts and hard exceptions. Rollback is subject-relative:

- before source fencing, abort may leave source effective;
- after source fencing but before target authority, rollback may require explicit re-enable/requalification;
- after target-issued effects, rollback is a new management transition, not time reversal;
- if provider/state identity was migrated, restoring an old artifact does not automatically restore old management identity;
- irreversible external effects remain historical facts.

`ROLLBACK CONFIG != ROLLBACK AUTHORITY != ROLLBACK EFFECTS`.

## Selective proof invalidation — avoid global requalification churn

Migration should invalidate proofs by dependency, not by provider-name adjacency alone.

Candidate proof dependencies:

```text
ProofDependency
  providerIdentity/version
  providerCapabilityClaim
  resourceSchema/version
  identityMapping
  managementAuthorityDimension
  fieldOwnershipScope
  credential/trust binding
  compilation mapping
  opaque-extension semantics
  effect-verification contract
```

Provider upgrade/migration invalidates only claims whose proof keys materially depend on changed dimensions. Portable semantic proofs independent of provider realization may remain reusable; current effect/authority claims must not inherit stale proof.

Candidate disposition:

```text
EXACT_REUSE
HISTORICAL_ONLY
REQUALIFY_PROVIDER_CAPABILITY
REQUALIFY_IDENTITY_MAPPING
REQUALIFY_AUTHORITY_SCOPE
REQUALIFY_EFFECT_VERIFICATION
RECOMPILE_AND_COMPARE
FULL_REQUALIFICATION
UNKNOWN
```

This preserves the existing G4 rule that proof reuse requires explicit basis completeness and avoids both extremes: unsafe blanket reuse and expensive global churn.

## Control Center / Application Manager implications

Application Manager should expose lifecycle and authority transition, not a single `Migrate` success badge. Control Center may coordinate the envelope and display affected resources, but cannot acquire target semantics by orchestration.

Required projections:

- source/target provider generation;
- imported/adopted/observe-only/co-managed disposition;
- authority vector and field/resource scope;
- external-object identity mapping;
- current manager(s);
- fence evidence/currentness;
- in-flight/UNKNOWN effects;
- target observation baseline and drift;
- proof invalidations/reuse;
- rollback/forward-only boundaries;
- unresolved exceptions.

Application-specific advanced provider UI remains available where SB cannot normalize semantics honestly.

## Application Portfolio Matrix delta

Keep the existing integration modes `Native SB / API-backed / Hybrid / Embedded / Proxied / Deep-link / Native bridge`. Add migration-specific qualification dimensions:

- **management-authority observability** — can SB distinguish observe/update/delete/etc. rather than infer one managed boolean?
- **external-object identity stability** — can identity survive provider/tool migration without ambiguous duplicate management?
- **handoff/fencing evidence** — can source authority loss and target authority gain be independently verified?
- **in-flight effect correlation** — can effects submitted by the old manager remain attributable and verifiable?
- **field/scope ownership fidelity** — can co-management conflicts be represented without fabricated equivalence?
- **detach/retirement semantics** — can SB stop managing without accidentally deleting or abandoning unresolved obligations?
- **proof invalidation granularity** — can upgrades invalidate only materially dependent claims?

Portfolio consequences:

- provider/infrastructure administration remains a strong **Hybrid/API-backed + Deep-link** candidate: native SB handles semantic intent, authority/provenance, impact, migration envelope and evidence; provider-native advanced UI handles semantics that cannot be normalized safely;
- **Embedded** remains conditional on security/licensing/session/currentness and adds no management authority by itself;
- **Proxied** remains exceptional and does not improve semantic ownership;
- **Native bridge** can be valuable for local/host tooling but must qualify physical-instance identity and authority after reconnect/upgrade;
- **Native SB** is justified where the semantic contract is portable and repeated across providers, not merely to avoid an external UI.

## Desktop / observability synthesis

This research does not change Desktop Sphere taxonomy. Migration work belongs primarily to Infrastructure/Operations spheres; monitoring evidence may be pinned elsewhere.

Preserve:

```text
Desktop Observatory != Pinned Monitoring Surface != Operations Desktop
Desktop widget != management application
Display Surface != Workspace
```

A migration dashboard is an operational projection. It does not become the manager simply because it displays authority state.

## Componentization complexity map

### C0/C1 — semantic primitives / atomic indicators

- `ManagementAuthorityDimensionRef`
- `ManagementDispositionRef`
- `ExternalObjectIdentityRef`
- `ProviderGenerationRef`
- `MigrationEpochRef`
- `FenceEvidenceRef`
- `ProofInvalidationDispositionRef`
- `InFlightEffectObligationRef`
- `AuthorityScopeBadge`
- `ObserveOnlyBadge`
- `DualMutationRiskIndicator`
- `FenceCurrentnessIndicator`

### C2 — compounds

- `ManagementAuthorityVector`
- `ManagerOverlapSummary`
- `MigrationSubjectRow`
- `IdentityMappingSummary`
- `FenceEvidenceSummary`
- `MigrationExceptionSummary`
- `ProofReuseInvalidationSummary`
- `InFlightEffectCarryoverSummary`

### C3 — reusable foundations

- `ManagementAuthorityQualifierBoundary`
- `ExternalObjectIdentityResolverBoundary`
- `ProviderMigrationEnvelopeBoundary`
- `ManagerFenceVerificationBoundary`
- `InFlightEffectCorrelationBoundary`
- `ProofDependencyInvalidationBoundary`
- `ProviderRetirementQualifierBoundary`
- existing `ProviderCapabilityQualifierBoundary`, `CompilationConformanceBoundary`, `EvidenceCorrelationBoundary`, `ImpactPreviewBoundary`, `CommandRegistry`, `WindowRegistry`, checkpoint/session and subscription foundations.

### C4 — tools / inspectors

- `ProviderMigrationImpactPreview`
- `MixedAuthorityInspector`
- `ImportedResourceAdoptionInspector`
- `ProviderRetirementInspector`
- `MigrationReconciliationInspector`

### C5 — specialized applications

- Application Manager;
- Control Center;
- Deployment/Hosting management;
- Binding/Vault management;
- provider-specific advanced administration surfaces/adapters.

### C6/C7 — workspace / task / system composition

- Infrastructure/Operations Desktop Sphere;
- Client Workspace migration task flow;
- Builder Home/Factory portfolio/fleet projection.

No C6/C7 object gains authority from composition. Foundations reduce repeated mechanics; specialized applications retain domain/provider semantics.

## Accessibility and small-screen equivalence

Migration cannot require topology diagrams, drag or dual-monitor spatial reasoning. A table/list projection must expose subject, current manager, target manager, authority dimensions, overlap/fence state, effect obligations, currentness and exceptions.

Every spatial/group action has a command/menu equivalent. `Transfer management`, `Keep observe-only`, `Fence source`, `Detach source`, `Reconcile effect` and `Open provider-native administration` are explicit actions subject to the same qualification path.

Small-screen presentation may serialize the workflow into staged pages/cards; it must preserve the same authority/evidence state and never collapse hard exceptions into a progress percentage.

## Performance/resource budgets

This round adds measurement targets but no fabricated numeric thresholds:

- qualification cost per migration subject and per changed proof dependency;
- affected-set derivation versus total portfolio size;
- selective proof invalidation ratio;
- target observation-baseline convergence time;
- fence verification latency;
- unresolved in-flight effect count/age;
- UI virtualization for thousands of subjects while retaining hard-exception visibility;
- migration aggregate recomputation cost under partial updates.

`Performance optimization != proof weakening`. Provider migration should scale by dependency-indexed requalification, not global rescans where evidence permits narrower invalidation.

## Adversarial proof matrix

1. Imported object attached observe-only; UI offers update before adoption -> blocked.
2. Same remote object imported under source and target managers -> duplicate-management warning; no silent dual authority.
3. Target provider can Observe but not Delete -> authority vector remains partial.
4. Source controller stopped but old credential remains accepted -> source fencing unproven.
5. Credential revoked locally but target API still accepts cached/session authority -> fencing remains unproven/partial.
6. Source freeze ACK lost -> migration cannot infer fence from timeout.
7. Target observation matches desired bytes but identity mapping is ambiguous -> no mutation authority.
8. Provider late-initializes field during baseline -> provider-derived provenance retained; not silently authored desired state.
9. Field A source-owned, field B target-owned -> co-management only under declared disjoint scope.
10. Both managers mutate same field after handoff -> `DUAL_MUTATION_UNSAFE` / reconciliation required.
11. Old provider effect ACK arrives after target activation -> correlate original occurrence; do not retry by default.
12. Old effect remains UNKNOWN during source retirement -> obligation survives retirement or retirement blocks per policy.
13. 999/1000 resources migrated; one destructive authority UNKNOWN -> aggregate cannot display unconditional success.
14. Rollback after target issued irreversible effect -> history retained; rollback cannot claim pre-migration world restored.
15. Provider version changes only presentation metadata -> unrelated semantic proofs remain reusable when dependency proof says so.
16. Provider version changes delete/replacement semantics -> affected authority/lifecycle proofs invalidated.
17. Opaque extension changes identity semantics -> migration blocked/re-authoring required until qualified.
18. External operator changes resource during target baseline -> contradiction/drift preserved; baseline not silently refreshed into consent.
19. Source detach operation would delete remote object -> impact preview blocks accidental management handoff destruction.
20. Target provider unavailable mid-migration -> source remains according to proven handoff phase; no inferred promotion.
21. UI/browser crashes after source fenced but before target enabled -> durable migration epoch/evidence recovers outcome; local pixels do not decide authority.
22. Deep-linked provider console remains open with old credentials -> external session is separately requalified; SB cannot assume closure fenced it.
23. Client/Environment context changes during migration -> authority/proof basis requalified before further mutation.
24. Provider-native UI says migration complete but SB effect verification is stale/contradictory -> provider UI is evidence, not universal authority.
25. Large portfolio invalidates every proof because provider display name changed -> conformance failure; invalidation must follow material proof dependencies.

## Proof obligations

PO-MA1. Every migration subject identifies semantic resource, external-object identity, provider/state identity and current management disposition separately.

PO-MA2. Import/observation cannot grant mutation/delete authority without explicit adoption/qualification.

PO-MA3. Management authority is operation/scope dimensional; a single managed boolean cannot authorize effects.

PO-MA4. Two managers with overlapping mutation authority require a declared safe merge/fencing law or remain `DUAL_MUTATION_UNSAFE/UNKNOWN`.

PO-MA5. Source retirement requires qualified loss of material source authority or an explicit unresolved-risk disposition; ACK/absence of heartbeat is insufficient.

PO-MA6. Target attachment/observation cannot become target mutation authority by implication.

PO-MA7. In-flight effects retain original manager/provider-generation lineage through migration and retirement.

PO-MA8. Migration/rollback never rewrites historical external effects or converts UNKNOWN into failure/success by convenience.

PO-MA9. Partial migration remains per-subject/per-authority visible; aggregate progress cannot hide hard exceptions.

PO-MA10. Provider upgrade/migration invalidates proofs by material dependency, preserving unrelated portable proof where qualified.

PO-MA11. Imported/provider-derived values preserve provenance and cannot silently become SB-authored desired configuration.

PO-MA12. Detach/forget and delete/destroy remain distinct lifecycle operations with separate impact preview.

PO-MA13. External/provider-native UI state is evidence only; it cannot silently supersede SB semantic intent/authority evidence.

PO-MA14. Recovery after browser/session loss requalifies the durable migration epoch, current managers, authority and unresolved effects before mutation resumes.

PO-MA15. Accessibility-equivalent list/table/command paths expose every material authority/fence/exception state without requiring spatial topology or drag.

## Contradictions / trade-offs

### Zero-overlap handoff vs availability

A strict stop-source-then-start-target handoff minimizes dual mutation but can create an unowned gap. Observe-first overlap reduces blindness but requires explicit fencing before target mutation. Resolution: permit dual observation; mutation overlap requires a proven law.

### Fast adoption vs baseline safety

Immediately enabling mutation after import is convenient but risks overwriting externally owned/provider-derived state. Resolution: observe/reconcile baseline first; adoption is explicit and may be partial.

### Easy rollback vs real external effects

Provider configuration can often be reverted quickly, but state identity, credentials, provider-generated defaults and already-issued effects may not be reversible. Resolution: rollback is a new qualified transition with phase-specific guarantees.

### Unified migration UX vs provider-native semantics

A universal wizard reduces cognitive load but can hide provider-specific identity/delete/import behavior. Resolution: native SB owns portable envelope/proof; provider-specific semantics remain explicit and may deep-link to mature tooling.

### Conservative full requalification vs scalable selective invalidation

Full requalification is simpler but creates unnecessary churn and can reduce availability. Selective invalidation is efficient but only safe with complete proof dependency keys. Resolution: narrow reuse only when dependency completeness is itself qualified; otherwise broaden requalification.

## Maturity / saturation

Disposition: `MATERIAL_DELTA / PARTIALLY_MATURE`.

- provider compilation/conformance: medium-high conceptual maturity;
- imported/adopted lifecycle: medium-high after this round;
- mixed management authority: medium-high conceptual maturity;
- provider migration authority handoff: medium-high conceptual maturity;
- external fencing evidence: medium; provider/effect-specific qualification remains open;
- selective proof invalidation: medium-high methodologically, empirical cost unknown;
- performance/resource budgets: medium-low empirically;
- accessibility/small-screen equivalence: medium-high contractually.

## Remaining material gaps / next vector

Highest-value next vector: **cross-device continuation and remote-session trust boundary** for the Web Desktop, but only after reconciling same-device WorkspaceSession work with management migration. Research should distinguish `same WorkspaceSession != same device trust`, device-bound credentials/passkeys, secret/non-persistable input recovery, external-app session transfer, local bridge identity, telemetry subscription disclosure, offline device revocation and stale-device fencing.

A secondary provider gap remains: concrete provider-specific fencing evidence classes for non-fenceable/slowly-revoked external effects. That should be researched only if it changes the generic authority contract rather than producing provider catalog trivia.

G4 remains `RESEARCH_ACTIVE / NON_EXECUTABLE`.