# G4 — Web Desktop Provider Compilation Conformance & Portability Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22
Scope: G4 Web Desktop & Application Environment — Application Manager / Control Center / declarative deployment / bindings / provider boundaries

## Purpose

Deep-gap continuation of the Web Desktop research after service-binding authority/provenance, cross-application change-set conformance, qualification-cache/effect-lineage and resource-stress work. The target is the provider boundary between portable semantic intent and provider-specific artifacts, especially upgrades, migrations and opaque extensions.

This is P&D documentation only. It does not authorize implementation, WBS, Work Packages, Sprints, TASKs, migrations, provider adoption or package changes.

## Inputs reconciled

Recent :00/:10/:20/:40 outputs establish:

- proactive client intervention remains separately authorized from Fleet visibility;
- qualification reuse requires semantic proof keys and explicit basis completeness;
- cross-application changes are coordination envelopes, not global transactions;
- resource pressure may degrade rendering/residency but cannot erase currentness, dirty state or UNKNOWN effects;
- service binding separates semantic requirement from provider realization and keeps Desired / Observed / Effective distinct.

This round does not reopen those conclusions. It asks what must be proven when a portable `ServiceDefinition` / `DeploymentIntent` is compiled into a provider artifact and that provider or API later changes.

## External evidence reviewed

Pattern evidence only; no adoption decision is implied.

### OpenTofu / Terraform provider model

OpenTofu providers are independently versioned plugins. Production guidance recommends explicit provider version constraints and lock files because a newer provider may be incompatible with an existing configuration. Provider documentation is versioned. Provider schemas themselves have format versions and resource identity schemas may have independent versions. `state replace-provider` is an explicit, backed-up migration operation rather than an invisible alias swap.

Terraform Plugin Framework exposes `null`, `unknown` and known as distinct value states, and provider plan/apply consistency is checked; unknown planned values are not equivalent to defaults or failure.

Portable lessons:

- provider protocol compatibility does not prove resource-semantic compatibility;
- provider version is part of qualification basis;
- provider identity migration is a state/identity transition, not mere UI relabeling;
- unknown provider-computed values must remain unknown until resolved.

### Kubernetes API conversion and field ownership

Kubernetes CRDs may serve multiple API versions while storing one version and use conversion webhooks when requested/stored versions differ. Server-Side Apply tracks field managers and reports ownership conflicts rather than silently treating all writers as one owner.

Portable lessons:

- representation conversion is not automatically semantic equivalence;
- conversion provenance/version belongs in evidence;
- ownership conflicts survive serialization/representation changes;
- provider-native defaulting or conversion must not be mistaken for SB-authored semantic intent.

### Crossplane provider behavior

Crossplane management policies distinguish observe/create/update/delete/late-initialize, and provider support for those policies is provider-specific. Upgrade guidance warns against casually changing live compositions and shows that apparently schematically similar resources can change API group/version.

Portable lessons:

- a provider's management capabilities are independently qualified;
- `Observe` authority is not mutation authority;
- late initialization is observed/provider-derived state, not silently desired intent;
- schema similarity does not prove live migration safety.

## Core finding — compilation is a proof-carrying derivation, not serialization

Candidate chain:

```text
ServiceDefinition
  -> DeploymentIntent
  -> BindingResolutionPlan
  -> ProviderCapabilityQualification
  -> ProviderCompilationPlan
  -> ProviderArtifact
  -> ProviderSubmission
  -> ProviderObservedState
  -> EffectiveServiceClaim
```

The provider artifact is a realization of semantic intent under a qualified provider/API/profile, not canonical meaning.

```text
YAML/provider artifact != semantic definition
COMPILATION SUCCESS != SEMANTIC PRESERVATION PROVED
PROVIDER ACCEPTED != EFFECTIVE
SCHEMA VALID != GUARANTEE PRESERVED
```

Candidate evidence object:

```text
ProviderCompilationEvidence
  semanticIntentDigest
  resolvedBindingDigest
  providerIdentity
  providerVersion
  providerProtocolVersion?
  providerSchema/API revision
  compilerIdentity/version
  capabilityQualificationRef
  generatedArtifactDigest
  mappingClaims[]
  unsupportedClaims[]
  defaultedClaims[]
  opaqueExtensionClaims[]
  roundTripDisposition
  verificationContractRef
  currentness
```

## Guarantee preservation is claim-relative

Compilation conformance should be evaluated over the guarantees required by the intent, not textual similarity between artifacts.

Candidate dispositions per semantic claim:

```text
PRESERVED_EXACT
PRESERVED_BY_STRONGER_PROVIDER_GUARANTEE
PRESERVED_WITH_DECLARED_TRANSFORMATION
PROVIDER_DEFAULTED
PROVIDER_OBSERVED_ONLY
OPAQUE_EXTENSION
DEGRADED_WITH_EXPLICIT_ACCEPTANCE
UNSUPPORTED
UNKNOWN
```

A stronger value in one dimension cannot compensate for an unknown or violated hard guarantee in another.

Examples:

- provider placement constraint may be stronger than the portable minimum and still conform;
- provider-generated identifier may legitimately be unknown before apply;
- provider default timeout cannot silently become portable desired intent;
- provider-native availability mode may be semantically richer but must expose what portable claims it satisfies;
- an opaque annotation that controls deletion or public exposure is materially semantic even if the compiler cannot normalize it.

## Provider capability profile is versioned evidence

Candidate:

```text
ProviderCapabilityProfile
  providerIdentity
  providerVersion
  API/schema revisions[]
  supportedSemanticClaims[]
  unsupportedSemanticClaims[]
  managementCapabilities[]
  defaultingRules[]
  identityRules[]
  replacementTriggers[]
  import/adoptionCapabilities[]
  observationCapabilities[]
  extensionNamespaces[]
  qualificationEvidenceRefs[]
  currentness
```

`provider installed != provider qualified`.

An upgrade can invalidate only affected claims when compatibility evidence is complete; otherwise qualification widens conservatively.

```text
same provider name != same capability profile
protocol compatible != resource semantically compatible
schema readable != migration safe
```

## Drift taxonomy across the provider boundary

Provider drift should not collapse into one generic `DRIFT` badge.

Candidate kinds:

```text
COMPILER_DRIFT
PROVIDER_VERSION_DRIFT
PROVIDER_API_DRIFT
SCHEMA_DRIFT
DEFAULTING_DRIFT
IDENTITY_RULE_DRIFT
REPLACEMENT_SEMANTICS_DRIFT
MANAGEMENT_CAPABILITY_DRIFT
OPAQUE_EXTENSION_DRIFT
OBSERVATION_DRIFT
```

Each drift kind names which prior compilation/migration proofs become stale.

`provider upgrade available != current artifact invalid` and `provider upgrade installed != old proof current`.

## Opaque extensions create explicit portability debt

Provider-specific escape hatches are useful and sometimes necessary. Banning them would force the portable model to become a lowest-common-denominator platform. Treating them as harmless, however, fabricates portability.

Candidate:

```text
OpaqueExtensionClaim
  providerIdentity
  namespace/key/path
  semanticClassification
    PRESENTATION_ONLY
    OPERATIONAL_NON_SEMANTIC
    GUARANTEE_AFFECTING
    AUTHORITY_AFFECTING
    IDENTITY_AFFECTING
    LIFECYCLE_AFFECTING
    UNKNOWN
  migrationSupport
    PORTABLE_MAPPING_KNOWN
    PROVIDER_TO_PROVIDER_ADAPTER_KNOWN
    REAUTHOR_REQUIRED
    NON_PORTABLE
    UNKNOWN
  currentness
```

Hard rule:

```text
OPAQUE != IRRELEVANT
UNKNOWN EXTENSION SEMANTICS != SAFE TO MIGRATE
```

If an extension can change authority, exposure, deletion, identity, persistence, availability or effect behavior, migration remains blocked/qualified until its semantics are understood or explicitly re-authored.

## Portability is a vector, not a percentage

Candidate `PortabilityDisposition` dimensions:

```text
semanticClaims
identityContinuity
stateContinuity
bindingContinuity
secretRefContinuity
placementContinuity
authorityContinuity
observationContinuity
rollback/remediation
opaqueExtensionCoverage
providerCurrentness
```

Useful outcomes include:

```text
PORTABLE_AS_IS
PORTABLE_WITH_REQUALIFICATION
PORTABLE_WITH_DECLARED_TRANSFORMATION
PORTABLE_WITH_STATE/IDENTITY_MIGRATION
REAUTHOR_REQUIRED
NON_PORTABLE_FOR_NAMED_CLAIMS
UNKNOWN
```

Do not produce a scalar `87% portable` as authority.

## Migration is not recompilation

A new provider artifact for the same semantic definition does not imply that existing live state can safely move to it.

Candidate migration chain:

```text
MIGRATION_PROPOSED
 -> SOURCE_STATE/IDENTITY_CAPTURED
 -> TARGET_PROVIDER_QUALIFIED
 -> SEMANTIC_MAPPING_QUALIFIED
 -> OPAQUE_EXTENSIONS_CLASSIFIED
 -> IDENTITY/STATE_MIGRATION_PLANNED
 -> IMPACT_PREVIEWED
 -> AUTHORIZED
 -> TARGET_SUBMITTED
 -> TARGET_OBSERVED
 -> SOURCE_AUTHORITY/FENCING_SETTLED where material
 -> EFFECT_VERIFYING
 -> EFFECTIVE | PARTIAL | UNKNOWN | REMEDIATION_REQUIRED
```

`same desired definition != same live resource identity`.

OpenTofu's explicit provider-state replacement is useful evidence that provider identity/state association deserves a deliberate transition and backup/recovery boundary.

## Round-trip testing has bounded meaning

Candidate conformance checks:

1. compile portable intent to provider artifact;
2. normalize only declared representation noise;
3. parse/import provider representation back to an observed semantic projection where supported;
4. compare named guarantee claims, not text;
5. preserve unknown/defaulted/opaque distinctions.

But:

```text
round-trip textual equality != semantic equivalence
semantic projection equality != effect equivalence
```

Some provider semantics are only testable through plan/apply/observe/effect evidence. Round-trip is one proof class, not the proof.

## Defaulting and late initialization

Provider/API defaults need provenance.

Candidate provenance:

```text
EXPLICIT_SB_DESIRED
INHERITED_SB_CONFIGURATION
POLICY_CONSTRAINED
AUTO_BINDING_SELECTED
PROVIDER_COMPILED_DEFAULT
PROVIDER_SERVER_DEFAULT
OBSERVED_LATE_INITIALIZED
EXTERNAL_ACTOR_MUTATION
UNKNOWN_ORIGIN
```

A late-initialized/provider-defaulted value may be adopted into future desired intent only through an explicit adoption/reconciliation action. Observation does not silently rewrite semantic definition.

`default observed != desired authored`.

## Application Portfolio Matrix delta

The existing seven integration modes remain valid: `Native SB / API-backed / Hybrid / Embedded / Proxied / Deep-link / Native bridge`.

Add two provider-boundary criteria to the portfolio qualification of management/deployment applications:

- **compilation transparency** — can the UI explain semantic intent -> provider artifact mappings, defaults, unsupported/opaque fields and compiler/provider basis?
- **migration portability** — can provider/API upgrades or replacement preserve identity/state/guarantees, or does the task require explicit re-authoring/migration tooling?

Indicative implications:

| Task | Likely mode mix | Provider-boundary requirement |
| --- | --- | --- |
| Service definition/edit | Native SB | semantic intent remains provider-neutral; opaque extensions explicitly scoped |
| Deployment preview | Native SB + API-backed | show provider-specific consequence without making provider artifact canonical |
| Advanced provider administration | Hybrid / Deep-link | retain qualified original tool where SB normalization would fabricate equivalence |
| Existing-resource adoption/import | Native SB + API-backed | distinguish discovered/observed fields from adopted desired intent |
| Provider migration | Native SB + API-backed + optional Deep-link | explicit identity/state/extension mapping and recovery evidence |
| Provider diagnostics | API-backed / Hybrid / Deep-link | provider-native evidence can remain provider-qualified rather than normalized away |

No mode is globally preferred; security, compatibility, licensing, authority, currentness, UX, lifecycle, replaceability, lock-in, binding transparency, effect observability, compilation transparency and migration portability remain task-specific dimensions.

## Control Center / Application Manager consequences

The Application Manager should distinguish:

```text
PROVIDER DISCOVERED
PROVIDER INSTALLED
PROVIDER REGISTERED
PROVIDER QUALIFIED_FOR(claim/profile)
PROVIDER ACTIVE_FOR(binding/intent)
PROVIDER UPGRADE_AVAILABLE
PROVIDER UPGRADE_PROPOSED
PROVIDER UPGRADE_REQUALIFYING
PROVIDER DRIFTED
PROVIDER RETIRED
```

The Control Center may coordinate provider policy/version constraints and show blast radius, but it does not become provider-semantic authority.

A global provider upgrade change set must bind:

- affected ServiceDefinitions/DeploymentIntents;
- provider capability-profile delta;
- compilation-proof invalidation;
- opaque-extension inventory;
- live identity/state migration consequences;
- externally managed/adopted resources;
- rollback/remediation limits;
- observation/effect verification plan.

## External mature-tool reuse

Provider-native consoles, CLIs and admin UIs remain valuable where they expose specialist behavior SB cannot safely normalize. Deep-link/Hybrid/API-backed integration is preferable to rebuilding advanced provider consoles merely for visual uniformity.

SB-native responsibility is narrower and stronger:

- semantic intent authoring;
- provider qualification summary;
- mapping/provenance explanation;
- impact/change-set preview;
- authority/currentness display;
- migration/upgrade coordination;
- cross-provider comparison only for claims that are genuinely normalized.

`adapter normalization != fabricated semantic equivalence` remains a hard boundary.

## Componentization complexity map delta

No WBS is materialized. Candidate complexity layers:

### C0/C1 — primitive references/states

- `ProviderIdentityRef`
- `ProviderVersionRef`
- `ProviderSchemaRevisionRef`
- `CompilationEvidenceRef`
- `MappingDispositionRef`
- `OpaqueExtensionRef`
- `PortabilityDispositionRef`
- `ProviderDriftRef`

### C2 — compounds

- `ProviderQualificationBadge`
- `CompilationMappingRow`
- `OpaqueExtensionIndicator`
- `ProviderDriftIndicator`
- `PortabilityFacetSummary`
- `DefaultingProvenanceIndicator`

### C3 — shared foundations

- `ProviderCapabilityQualifierBoundary`
- `SemanticToProviderCompilerBoundary`
- `ProviderArtifactInspectorBoundary`
- `CompilationConformanceBoundary`
- `ProviderMigrationPlannerBoundary`
- `ProviderStateIdentityBoundary`
- `OpaqueExtensionClassifierBoundary`

These are high-reuse foundations across Application Manager, Control Center, deployment tools and provider-backed applications.

### C4 — tools/inspectors

- `ProviderQualificationInspector`
- `CompilationDiffInspector`
- `OpaqueExtensionInspector`
- `ProviderUpgradeImpactPreview`
- `ProviderMigrationInspector`
- `PortabilityMatrixInspector`

### C5 — specialized applications

- Application Manager
- Control Center
- Deployment/Hosting Manager
- Binding/Vault Manager
- Provider Administration bridge

### C6/C7 — Desktop/Workspace/System views

Desktop Sphere, Workspace and Builder Home compose the above without acquiring provider authority. Observatory consumes provider/effect evidence but does not become deployment authority.

## Accessibility and small-screen equivalence

Compilation/migration proof must not depend on a graph or diff visualization alone.

Required equivalents:

- keyboard-accessible claim/mapping table;
- textual provenance for defaults and opaque extensions;
- non-color disposition labels;
- ordered impact/recovery summary;
- command alternatives for migration/requalification actions;
- small-screen drill-down preserving semantic identity/currentness;
- screen-reader announcement of newly discovered blocking drift without storming live regions.

## Performance/resource implications

Provider schemas/artifacts can be large. Resource qualification should prefer:

- lazy provider-schema loading;
- virtualized mapping/diff tables;
- content-addressed qualification evidence;
- claim-scoped invalidation after provider upgrades;
- worker/off-main-thread parsing/diff where measured useful;
- no render-all of provider schemas/artifacts;
- cache reuse only when semantic proof key and basis completeness permit it.

Resource pressure never permits dropping an unsupported/opaque/UNKNOWN guarantee from migration analysis.

## Adversarial proof matrix

| Scenario | Required disposition |
| --- | --- |
| Provider protocol remains compatible but resource default changes | prior compilation proof becomes stale for affected claims |
| API schema adds optional field | no global invalidation unless material mapping/default/guarantee changes; qualification explains scope |
| API removes/renames field used by compiler | compilation blocked or transformed with explicit qualified mapping |
| Provider-computed value unknown until apply | remain UNKNOWN in plan; do not invent default/effect |
| Provider server defaults a security-relevant field | provenance visible; semantic adoption requires explicit reconciliation |
| Late initialization discovers external value | observed != desired; no silent rewrite |
| Opaque annotation controls deletion | classify lifecycle-affecting; migration blocked until mapped/re-authored |
| Provider upgrade changes replacement semantics | upgrade impact must expose possible replacement/state consequence |
| New provider uses same field names | no equivalence inference from names/schema shape |
| State/import identity differs across providers | explicit identity migration/reconciliation required |
| Old provider ACKs delete but resource remains | ACK != effect; source settlement remains open |
| Migration succeeds for 99/100 resources | PARTIAL, not global EFFECTIVE |
| External actor mutates provider artifact | observed external mutation/drift; do not rewrite semantic definition automatically |
| Provider console shows healthy while SB evidence stale | HEALTHY provider view != current SB effect proof |
| Provider documentation/version unavailable | affected semantic mapping remains UNKNOWN, not assumed compatible |

## Proof obligations

1. Every provider artifact traces to immutable semantic intent/binding basis and compiler/provider identity/version.
2. Every material semantic claim has a mapping disposition; unsupported/opaque/unknown claims cannot disappear from summaries.
3. Provider defaults and late-initialized values retain provenance and do not silently become desired intent.
4. Provider/API upgrade invalidates only claims proven dependent on changed semantics; incomplete dependency proof widens conservatively.
5. Provider protocol/schema compatibility never substitutes for guarantee/effect compatibility.
6. Provider migration separately proves semantic mapping, identity/state continuity, authority/fencing where material, and effect verification.
7. `UNKNOWN` remains representable throughout compile/plan/apply/observe/reconcile.
8. External mature tools may retain provider-native semantics; SB adapters cannot fabricate normalized equivalence.
9. Aggregated portfolio/control-center views preserve any hard `UNSUPPORTED`, `OPAQUE`, `STALE`, `UNKNOWN`, `PARTIAL` or remediation-required state.
10. Accessibility equivalents expose the same authority/currentness/mapping facts as visual diff/graph views.

## Saturation / maturity

- Web Desktop shell/window/session: high conceptual maturity.
- Application Portfolio/integration taxonomy: medium-high.
- Application Manager lifecycle: medium-high.
- Control Center provenance/change-set coordination: medium-high.
- ServiceDefinition/binding authority chain: medium-high.
- Provider compilation conformance: **medium-high after this round**.
- Provider migration/opaque-extension portability: **medium; material gaps remain**.
- Resource budgets: methodology medium-high, empirical thresholds still pending implementation-era measurement.
- Accessibility/small-screen: medium-high contractually, empirical usability validation pending.

Research remains active. No implementation readiness claim is made.

## Remaining gaps / next vector

Highest-value next vector: **provider upgrade/migration under live mixed management authority and imported/adopted state**, especially:

- SB-managed + externally managed + observe-only resources in one provider-upgrade blast radius;
- import/adoption provenance versus desired ownership;
- state identity handoff when target provider cannot preserve provider-native identity;
- rollback after partial migration when old and new providers can both still mutate;
- provider retirement with in-flight operations and unresolved UNKNOWN effects;
- proof-key invalidation across compiler/provider upgrades without global requalification churn.

This vector can materially change Application Manager lifecycle, Control Center change-set semantics, provider migration state machines and future WBS decomposition, so research should not yet be declared saturated.