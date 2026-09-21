# G4 Capability Exchange — Effect-Path Universe Discovery and Change Detection

Date: 2026-09-21
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: Generation 4 product R&D only
Implementation authority: NONE

## 1. Research question

This consolidation continues `G4_CAPABILITY_EXCHANGE_EFFECT_GATE_COMPLETE_MEDIATION.md` and asks:

> How can a capability maintain sufficiently sound knowledge of the paths capable of producing a protected effect when code generation, reflection, plugins, provider SDKs, configuration, recovery tooling and deployment topology can create, remove or redirect paths — without requiring omniscient static analysis, exhaustive runtime tracing, or a central runtime oracle?

Constitutional boundaries remain unchanged:

- `G3 semantic decision != G4 technology binding`;
- `Research candidate != implementation authority`;
- `Builder != Runtime`;
- `Shared primitives != shared business ownership`;
- `Logical Exchange Plane != single broker`;
- `Exchange Plane owns exchange semantics; capability owns business semantics`;
- `observed path != complete path universe`;
- `path inventory != business ownership`;
- `topology discovery != semantic authority`.

## 2. Evidence base

Primary standards and mature-system documentation reviewed:

1. **Java `ServiceLoader` / module services** — providers may be discovered and instantiated lazily, provider caches can be reloaded, providers can be added dynamically by instrumentation agents, and module-layer/provider ordering has intentionally limited guarantees. This is direct evidence that extension paths can appear at runtime even when a static source graph was previously inspected. <https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/ServiceLoader.html>
2. **SLSA Build Provenance** — separates declared/external parameters from resolved dependencies and explicitly treats resolved-dependency completeness as best effort, while tying provenance meaning to a builder/build type and trust boundary. This is useful precedent for expressing coverage and provenance without claiming omniscience. <https://slsa.dev/spec/v1.0/requirements> and <https://slsa.dev/spec/v1.2-rc2/build-provenance>
3. **Kubernetes dynamic admission control** — webhook applicability, side effects, failure policy and reinvocation are explicit; later mutations can alter objects after earlier mutating admission and a validating stage is recommended when final-state validation matters. Kubernetes also requires reconciliation for webhook side effects because admission invocation does not prove final persistence. This is concrete evidence that dynamic composition and later mutation can invalidate earlier path/policy assumptions. <https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/>
4. **Kubernetes manifest-based admission control (v1.36)** — documents bootstrap/recovery gaps in dynamically installed admission policy and introduces pre-serving static admission manifests for policies that must be present from startup. This is failure evidence that discovery/enforcement coverage has a bootstrap dimension, not only steady-state topology. <https://kubernetes.io/blog/2026/05/04/kubernetes-v1-36-manifest-based-admission-control/>
5. **OpenTelemetry eBPF Instrumentation (OBI)** — can discover network/protocol activity without application changes, but explicitly cannot derive all application-specific/business details and supports only bounded packages/protocols. This is mature evidence that runtime observation is valuable positive evidence but cannot prove semantic completeness. <https://opentelemetry.io/docs/zero-code/obi/>
6. **NIST SP 800-53 Rev. 5 CM-8** — system component inventory includes automated maintenance and automated detection of unauthorized components. This provides a governance precedent for treating inventory as a continuously maintained control with explicit unauthorized-component handling, rather than a one-time design artifact. <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53r5.pdf>
7. **WASI Preview 1 capability-based sandboxing** — preopened directories provide a capability-based mechanism constraining accessible resources. This is useful as an example of structural exclusion evidence: discovery can be incomplete while the effect channel is nevertheless bounded by a capability envelope. <https://wasi.dev/releases/wasi-p1>
8. Existing G4 research on dependency-lineage soundness, opaque non-dependency evidence, complete mediation, provider/driver semantics, topology substitution, retries, recovery, policy currentness and evidence compaction.

These are benchmarks only. No JVM module system, SLSA level, Kubernetes admission mechanism, eBPF/OTel stack, NIST control implementation, WASI runtime, plugin framework or analysis engine is selected.

## 3. Material delta

Previous G4 research established:

`complete mediation -> every effect-producing path is gated, structurally excluded, or explicitly outside scope`.

The missing question was how the system can know that its `EffectPathUniverseRef` remains sufficiently representative when paths can be introduced dynamically.

This round proposes:

> Effect-path discovery is a continuously qualified inventory problem. Soundness comes from combining independent evidence classes and constraining unknown space, not from promoting one static graph or one runtime trace into an oracle.

Therefore:

`path inventory present != path universe complete`.

and:

`no new path observed != no new path exists`.

The stronger target is a qualified statement of coverage:

`EffectPathUniverseQualification = <protected effect, declared producers, generated artifacts, dynamic extension surfaces, reachable effect capabilities, topology, observation coverage, structural exclusions, opaque zones, currentness, limitations>`.

## 4. Path sources must be typed

A path can arise from materially different mechanisms. Treating them all as generic call edges loses the information needed to discover change.

Candidate source classes:

- **declared static path** — source/contract explicitly names an effect-capable port;
- **generated path** — compiler/codegen/partial evaluation emits a caller or handler;
- **configuration-selected path** — feature flag, route, policy, binding or provider selection activates an existing capability;
- **dynamically loaded path** — plugin/module/service provider is discovered at runtime;
- **reflective path** — runtime name/type lookup selects executable behavior;
- **topology path** — deployment/routing/service discovery creates a reachable route to an effect boundary;
- **callback path** — provider/third party invokes an inbound effect-capable callback;
- **recovery path** — replay, restore, reconciliation, migration or operator tooling can materialize effects;
- **privileged/manual path** — administrative/debug/break-glass tooling can reach the effect primitive;
- **opaque internal path** — proprietary component may contain effect-capable behavior not externally enumerable.

`same effect != same discovery mechanism`.

## 5. Capability envelope before call graph

A useful upper bound is not merely “who calls whom?” but “which principals/components possess any mechanism capable of committing this effect?”

Candidate `EffectCapabilityEnvelopeRef` describes the principals, credentials, ports, OS/resource capabilities, provider rights and target interfaces that could make an effect possible.

This permits a two-stage qualification:

1. enumerate/qualify effect-capable holders and channels;
2. enumerate paths from origins to those holders/channels.

If a plugin has no credential, port, syscall/resource capability or target access capable of producing effect E, it can be structurally excluded even when its internal call graph is opaque.

Thus:

`internal behavior unknown + effect capability absent -> candidate structural exclusion`.

But:

`one effect channel absent != effect impossible`.

The envelope must cover all declared channels for that protected effect.

## 6. Discovery evidence classes

No single evidence class is sufficient in general.

### 6.1 Declared/design evidence

Contracts, manifests, port declarations, provider bindings and plugin descriptors can enumerate intended effect surfaces.

Strength: reviewable and technology-independent.

Weakness: declarations can be stale or incomplete.

`declared path != deployed path`.

### 6.2 Build/generated evidence

Compiler/build output can record generated handlers, imports, provider bindings and artifacts. SLSA is a useful precedent for recording build parameters/dependencies while keeping completeness explicit rather than assumed.

Strength: catches paths introduced by generation that source-level review may miss.

Weakness: runtime reflection/configuration may create additional paths.

`generated inventory complete for build != runtime universe complete`.

### 6.3 Deployment/topology evidence

Routes, identities, service bindings, credentials, network reachability and workload configuration show which effect channels are deployed/reachable.

Strength: captures environment-specific realizations.

Weakness: reachability does not prove semantic use, and local/in-process paths may not appear in network topology.

`reachable != used != authorized`.

### 6.4 Runtime observation

Tracing, eBPF, logs and audit events can positively identify exercised paths. OTel OBI is useful precisely because it demonstrates both the value and the limitation: network/protocol behavior can be observed without code changes, but business semantics not visible at the probe cannot be reconstructed automatically.

`observed path -> positive existence evidence`.

`unobserved path -> not non-existence evidence`.

### 6.5 Structural exclusion evidence

Least privilege, capability sandboxing, target-side policy, credential scope, immutable interfaces and OS/resource restrictions can exclude classes of paths even when enumeration is incomplete.

Strength: constrains the unknown space.

Weakness: exclusion is mechanism/effect/revision scoped and can be invalidated by configuration/provider changes.

### 6.6 Opaque attestation

A third-party component may attest to a bounded effect-capability or mediation property without disclosing internals. This inherits the previous G4 rule:

`attestation != semantic authority`.

Coverage, verifier, profile, freshness and limitations remain explicit.

## 7. Dynamic extension surfaces are first-class dependencies

Java `ServiceLoader` provides a useful mature example: providers are located lazily, caches can be reloaded, and runtime/module instrumentation can introduce providers. The exact mechanism is not important; the general lesson is:

`extension point stable != provider set stable`.

Therefore an effect-path universe that includes a dynamic extension surface must bind not only the extension API but also a qualified **provider-set observation/floor** or a structural rule that prevents unknown providers from obtaining the protected effect capability.

Candidate rule:

`dynamic extension + effect capability -> provider-set change is mediation-requalification relevant`.

If unknown plugins can be installed while retaining effect credentials, a previous complete-mediation claim cannot remain `COMPLETE` merely because the interface did not change.

## 8. Generated code and build provenance

Generated code can introduce effect paths absent from hand-written source. A build-time inventory therefore needs lineage to:

- generator/build type;
- generator revision/profile;
- external parameters;
- resolved dependencies where known;
- generated artifact identity;
- discovered effect-capable imports/ports;
- coverage limitations.

SLSA's explicit best-effort treatment of resolved-dependency completeness is a useful guardrail: provenance can be highly trustworthy while still incomplete for a particular question.

`trusted provenance != complete effect-path proof`.

A build artifact whose path inventory cannot account for dynamic extension/configuration surfaces remains partially qualified.

## 9. Configuration is executable topology

Feature flags, provider bindings, routes, credentials, callback registrations and policy selectors can activate/deactivate effect paths without changing application binaries.

Therefore:

`same artifact hash != same effect-path universe`.

Candidate `EffectPathConfigurationRef` binds the path qualification to configuration facts material to effect reachability/authority.

This does not make configuration canonical business truth. It makes configuration a qualified dependency of the mediation proof.

## 10. Bootstrap and recovery are part of the universe

Kubernetes v1.36's manifest-based admission work documents a concrete bootstrap/recovery gap: dynamically created admission policy can be absent while the API server is already serving, and some admission configuration cannot protect itself from deletion through the same chain.

G4 generalizes:

`steady-state mediation proof != bootstrap/recovery mediation proof`.

Effect-path qualification must include phases such as:

- initial bootstrap;
- normal steady state;
- upgrade/topology migration;
- disaster recovery/restore;
- break-glass operation;
- rollback/failback;
- plugin/provider installation/removal.

A path that exists only during recovery is still a path if it can commit the protected effect.

## 11. Mutation after discovery requires requalification

Kubernetes mutating admission provides another useful analogy: later mutations can create structures that earlier plugins did not observe, and reinvocation is not an unlimited guarantee. Final validation is distinct from intermediate mutation.

For G4:

`path inventory valid before transformation != path inventory valid after transformation`.

Material transformations include:

- code generation;
- dependency injection/provider rebinding;
- plugin activation;
- route/service discovery update;
- credential expansion;
- topology migration;
- recovery tool enablement;
- callback registration;
- policy/config changes that create new effect rights.

A qualified change detector should invalidate/requalify only affected mediation claims rather than globally rebuilding all path inventories.

## 12. Change detection is dependency-scoped

Candidate `EffectPathChangeTriggerRef` names a fact whose change may alter a path universe. Examples:

- generated artifact revision;
- plugin/provider-set revision;
- route/topology revision;
- credential/capability envelope revision;
- provider SDK/API surface revision;
- callback registry revision;
- recovery-tool revision;
- configuration/profile revision;
- structural-exclusion mechanism revision.

This connects directly to previous G4 dependency-lineage work:

`path change reachable in dependency graph != path change materially affects every effect`.

Each complete-mediation claim retains only the trigger lineage material to its protected effect.

## 13. Soundness vs precision

For safety-sensitive effects, a conservative superset of candidate paths can be sound even if imprecise.

`over-approximation may be safe; under-approximation may hide bypass`.

But “everything can call everything” is not useful qualification. Excessive over-approximation causes permanent `UNKNOWN`, unnecessary gates and requalification storms.

Therefore the target is **bounded conservative coverage** supported by structural exclusion and explicit opaque zones.

## 14. Coverage dispositions

Candidate research dispositions:

- `QUALIFIED_COMPLETE_FOR_SCOPE` — declared evidence classes and exclusions cover the named effect/path universe under stated assumptions;
- `QUALIFIED_CONSERVATIVE` — safe over-approximation exists but precision is lower;
- `PARTIAL` — material classes are known to be uncovered;
- `OPAQUE` — a component/path family cannot be inspected or externally excluded sufficiently;
- `STALE` — path-universe dependencies changed beyond the qualification horizon;
- `REQUALIFICATION_REQUIRED` — material trigger changed;
- `UNKNOWN` — evidence is insufficient to claim either coverage or safe exclusion.

No disposition means global completeness for the whole system.

## 15. Change observation is not change authority

The Exchange Plane, deployment system, build system, telemetry stack or security scanner may observe a path change. None becomes business owner by doing so.

`path change detected != business effect redefined`.

The capability/contract owner decides whether the changed path preserves the protected effect guarantee; distributed controllers may perform qualified re-evaluation under that contract.

## 16. Runtime autonomy

Published client runtimes must not depend on Builder availability to know whether their own protected effects remain mediated.

A runtime may carry a locally sufficient path-universe closure for its deployed artifact/configuration/topology and update it from local deployment/runtime evidence.

Therefore:

`Builder inventory unavailable != runtime mediation unknowable by definition`.

Conversely, a central Builder inventory cannot be treated as current truth for a runtime that has diverged locally.

## 17. Candidate vocabulary

Research vocabulary only:

- `EffectPathUniverseQualificationRef` — scoped qualification of path-universe coverage.
- `EffectPathSourceKind` — static/generated/configured/dynamic/reflective/topology/callback/recovery/manual/opaque source classification.
- `EffectCapabilityEnvelopeRef` — qualified set of principals/channels/resources capable of committing a protected effect.
- `EffectPathDeclarationRef` — declared/design evidence for a path.
- `GeneratedEffectPathEvidenceRef` — build/generator evidence of an emitted path.
- `DynamicExtensionSurfaceRef` — plugin/module/provider discovery surface capable of changing path membership.
- `EffectPathConfigurationRef` — configuration facts material to path activation/reachability.
- `EffectPathObservationRef` — runtime positive evidence that a path was exercised.
- `EffectPathExclusionRef` — structural evidence excluding a candidate path/effect channel.
- `EffectPathCoverageProfileRef` — evidence classes and limitations used for a coverage claim.
- `EffectPathChangeTriggerRef` — material dependency whose change requires selective requalification.
- `EffectPathUniverseRevisionRef` — identity of a qualified path-universe snapshot/closure.

These are not shared business entities or implementation commitments.

## 18. Candidate proof obligations

1. **PO-EPU-01 — Effect scope:** path-universe qualification is bound to a named protected effect/contract.
2. **PO-EPU-02 — Source typing:** static, generated, configured, dynamic, reflective, topology, callback, recovery and opaque sources are not silently collapsed.
3. **PO-EPU-03 — Capability envelope:** qualification accounts for every known holder/channel capable of committing the protected effect.
4. **PO-EPU-04 — No static omniscience:** static analysis alone cannot claim completeness where dynamic surfaces exist.
5. **PO-EPU-05 — No trace omniscience:** absence from runtime observation cannot establish non-existence.
6. **PO-EPU-06 — Generated lineage:** generated effect paths bind generator/build/profile/artifact lineage sufficient for requalification.
7. **PO-EPU-07 — Dynamic provider set:** extension/provider-set changes invalidate affected path-universe claims when providers can obtain effect capability.
8. **PO-EPU-08 — Configuration dependency:** configuration that changes effect reachability/authority is part of the mediation-proof dependency closure.
9. **PO-EPU-09 — Topology dependency:** deployment/routing change requalifies affected paths without redefining business semantics.
10. **PO-EPU-10 — Bootstrap coverage:** bootstrap/recovery paths are included where they can commit the protected effect.
11. **PO-EPU-11 — Privileged tooling:** operator/debug/break-glass tooling is not omitted merely because it is not a normal application path.
12. **PO-EPU-12 — Structural exclusion:** unknown internals may be excluded only by effect-scoped qualified constraints, not by lack of observation.
13. **PO-EPU-13 — Opaque honesty:** opaque components remain `OPAQUE/PARTIAL/UNKNOWN` unless externally fenced or sufficiently attested.
14. **PO-EPU-14 — Coverage currentness:** coverage claims bind revision/currentness of their material discovery and exclusion inputs.
15. **PO-EPU-15 — Change triggers:** material path-creation/removal mechanisms are represented as requalification triggers.
16. **PO-EPU-16 — Selective invalidation:** a path change invalidates only mediation claims materially dependent on that path family/evidence.
17. **PO-EPU-17 — No central oracle:** runtime safety does not require a central global path inventory.
18. **PO-EPU-18 — Local autonomy:** published runtimes retain locally sufficient mediation/path evidence for their declared autonomy horizon.
19. **PO-EPU-19 — Discovery/authority separation:** inventory/discovery systems do not become semantic owners or authorization authorities.
20. **PO-EPU-20 — Observation limits:** telemetry coverage and unsupported protocols/languages are explicit in the coverage profile.
21. **PO-EPU-21 — Provider SDK evolution:** SDK/API expansion can create a new effect channel even if the capability contract interface is unchanged.
22. **PO-EPU-22 — Callback registry:** inbound callbacks/webhooks capable of producing effects are tracked as path-universe dependencies.
23. **PO-EPU-23 — Recovery parity:** restore/replay/failover paths cannot bypass gates required in steady state.
24. **PO-EPU-24 — Evidence portability:** path-universe qualification can survive replacement of one scanner/tracer/mesh/build system when equivalent evidence is available.

## 19. Adversarial cases

1. Static call graph is complete for source code but a runtime plugin introduces a direct provider call.
2. Trace corpus never exercised an admin/recovery path and the path is incorrectly declared nonexistent.
3. Code generator emits a new effect handler after a template update while hand-written sources are unchanged.
4. Feature flag activates a direct provider route without changing artifact hash.
5. Provider SDK adds a new mutating API and existing credential scope permits it.
6. Reflection resolves a handler name from configuration and bypasses the route inventory.
7. Dynamic module/provider reload installs an effect-capable implementation after startup.
8. Plugin signature is valid and is mistaken for proof that the plugin lacks effect channels.
9. Network scanner sees no route, but an in-process library has the same provider credential.
10. eBPF telemetry sees protocol traffic but cannot identify the business operation and is promoted to semantic completeness.
11. Telemetry agent does not support a runtime/library and silently reports an empty path set.
12. Recovery tool writes canonical state directly while normal API paths are fully gated.
13. Break-glass script has database/provider credentials but is omitted from application inventory.
14. Callback endpoint registration changes at runtime and introduces a new effect origin.
15. Service discovery/routing update bypasses a previously mandatory mediation point.
16. Structural exclusion proves filesystem isolation but the effect is reachable through network/provider API.
17. WASI/sandbox capability set expands during deployment without requalifying mediation coverage.
18. Build provenance is authentic but resolved dependency/path completeness was only best effort.
19. Central inventory says plugin set P1 while autonomous runtime locally installed P2.
20. Runtime path observation is current but topology manifest is stale; aggregation incorrectly returns `COMPLETE`.
21. Provider-set inventory is complete, but a provider factory dynamically returns behavior with a new effect path.
22. Generated artifact path inventory is compacted and loses the generator/profile dependency needed for later requalification.
23. A topology migration temporarily enables both old and new routes, but inventory models only the destination topology.
24. Admission/discovery policy is installed after service startup, leaving a bootstrap gap treated as impossible.
25. A discovery controller fails open and absence of findings is interpreted as no bypass.
26. Scanner privilege is insufficient to inspect a namespace/tenant and silently reports it empty.
27. Effect-capability envelope lists service accounts but omits human/operator credentials.
28. Path inventory is shared globally and leaks tenant-specific integration topology.

## 20. Trade-offs

### Conservative over-approximation

Pros: safer against hidden paths.

Cons: more false positives, gates and requalification work.

### Deep static/build analysis

Pros: good pre-deployment coverage and reproducibility.

Cons: weak against reflection, runtime loading, configuration and opaque providers.

### Runtime observation

Pros: strong positive evidence of actual paths and topology.

Cons: cannot prove unobserved paths impossible; coverage depends on probes/workloads.

### Structural capability restriction

Pros: reduces the universe that must be enumerated and can fence opaque components externally.

Cons: mechanism-specific and can be invalidated by privilege/configuration expansion.

### Central inventory

Pros: convenient fleet visibility and analysis.

Cons: staleness, privacy leakage and accidental oracle/availability coupling. It remains projection/evidence, never canonical business truth.

## 21. Portability and exit path

The research model intentionally avoids binding path discovery to one scanner, language, service mesh, build system or runtime.

A portable future representation would preserve semantic facts such as:

- protected effect identity;
- path-source classification;
- effect-capability envelope;
- generated/deployed/configuration lineage;
- dynamic extension surfaces;
- structural exclusions;
- observation coverage;
- opaque zones;
- change triggers;
- coverage disposition/currentness;
- evidence references.

Static analyzers, build provenance systems, deployment controllers, eBPF agents, language agents, plugin registries and provider-specific scanners are replaceable evidence producers.

`discovery provider replaced != effect semantics replaced`.

## 22. Deduplication against existing G4 research

This round does **not** reopen:

- generic dependency-lineage completeness;
- opaque non-dependency proof;
- complete-mediation gate semantics;
- service-mesh selection;
- authorization-aware data access;
- provider/driver contract compatibility;
- retry/idempotency/fencing;
- topology DR/split-brain semantics;
- supply-chain implementation selection.

The material delta is specifically:

`complete-mediation requirement -> dynamic effect-path universe -> typed discovery evidence + capability envelope -> change-trigger lineage -> selective mediation requalification without static/tracing omniscience or central oracle`.

## 23. Maturity and next gap

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and is not saturated.

This round materially changes proof obligations because complete mediation now depends on a qualified, current effect-path universe rather than an unqualified inventory.

The next highest-value gap is **effect-capability envelope minimization and privilege drift**: how to prove and continuously requalify that components which do not need to produce a protected effect cannot acquire the necessary credential/port/resource/provider capability through deployment drift, delegation, secret propagation, plugin installation or recovery tooling — while avoiding a global IAM oracle and preserving autonomous runtimes.

No implementation is authorized by this finding.
