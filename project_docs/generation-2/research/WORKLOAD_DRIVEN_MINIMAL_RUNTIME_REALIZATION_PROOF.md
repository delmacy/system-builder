# Generation 2 — Workload-Driven Minimal Runtime Realization Proof

Status: RESEARCH COMPLETE / GATE DISPOSITION / NOT A NEW TOP-LEVEL CAPABILITY
Phase: RESEARCH_ELICITATION
Scope: exactly one centralized proof junction — workload-driven minimal runtime realization and its four registered hypotheses.

## Research question
Can the System Builder preserve a broad semantic capability universe while each generated client runtime contains only the capability/dependency closure and operational realization required by that client, and can the same canonical capability graph be realized as a collapsed/simple or split/scaled/critical topology without mutating business semantics?

## Representatives
1. Nix store closures / `nix why-depends` / `nix copy` — explicit transitive runtime closure, explanation of why a dependency exists, and transfer of a complete closure to another store.
2. Bazel dependency graph / `deps()` / `allpaths()` — explicit target dependency closure and path explanation from root target to transitive prerequisite.
3. Docker multi-stage builds — build-only tools can be omitted from the final runtime image while only selected runtime artifacts are copied forward.
4. Kubernetes Deployments / autoscaling / RuntimeClass — the same workload template can vary replica count and runtime configuration independently of application business semantics.
5. Knative Serving autoscaling — per-revision concurrency/scale bounds and scale-to-zero demonstrate workload-responsive realization without adding business capabilities.
6. AWS Lambda concurrency controls — runtime concurrency allocation can be changed for the same function according to observed demand/latency obligations.

## Evidence/source ledger
| Representative | Evidence | Architectural implication |
|---|---|---|
| Nix | Store paths maintain transitive reference closure; `nix why-depends` explains dependency paths; `nix-copy-closure` / export-import transfers the closure and dependencies. Sources: Nix Reference Manual `nix why-depends`, `nix-copy-closure`. | Runtime closure can be explicit, inspectable, explainable and transportable/offline-preparable. Unexpected references cause measurable closure bloat. |
| Bazel | `deps(target)` computes the transitive closure; `allpaths`/`somepath` explain inclusion paths; successful builds depend on declared dependency graphs. Source: Bazel Query documentation. | Every included build target can be justified by root requirement/dependency lineage; graph closure is distinct from product feature visibility. |
| Docker | Multi-stage builds selectively copy runtime artifacts and leave compilers/build tooling behind. Source: Docker multi-stage build documentation. | Build-time dependencies need not become runtime dependencies; omission is stronger than a disabled feature flag. |
| Kubernetes | Deployment replica count can change manually or through HPA; RuntimeClass selects alternate runtime configuration for a Pod, including stronger isolation at extra overhead. Sources: Kubernetes Deployment/autoscaling/RuntimeClass docs. | Operational topology and isolation profile can vary while workload/application semantics stay constant. |
| Knative | Revisions can scale from zero upward based on demand; concurrency and scale bounds are operational parameters; autoscaler implementation can vary. Source: Knative Serving autoscaling docs. | Same revision semantics can realize different runtime footprints over time; realization mechanics are not business capability inflation. |
| AWS Lambda | Reserved/provisioned concurrency is sized from observed requests/duration and latency criticality. Source: AWS Lambda provisioned concurrency docs. | Operational demand and SLOs can alter runtime allocation without changing function meaning. |

## Source of truth decomposition
No single artifact should own both business semantics and runtime realization.

- **Capability/System Definition truth** — required business/technical capabilities and semantic invariants.
- **Provider Binding truth** — which provider realization satisfies each capability contract.
- **Operational Requirement/Profile truth** — workload, SLO, recovery, locality, security/trust-zone, cost/resource and connectivity constraints. This is a first-class revisioned contract, but not a new capability owner.
- **Runtime Realization Plan truth** — concrete processes/services/resources/topology chosen to satisfy capability + provider + operational obligations.
- **Build/Image Manifest truth** — exact artifact/package/runtime closure emitted.
- **Observed Runtime truth** — actually instantiated processes/replicas/routes/bindings and their effective revisions.

## Identity and lineage
A realization must be identifiable by at least:

`semantic_definition_revision + capability_closure_revision + provider_binding_revision + operational_profile_revision + realization_policy_revision + build/toolchain identity + runtime realization revision`.

Every included runtime component must carry one or more lineage edges:

`explicit requirement → selected capability → transitive semantic/runtime dependency → provider/implementation dependency → artifact/runtime component`.

Components with no valid path are unexplained closure residue and must fail the minimal-closure proof unless explicitly classified as platform substrate with a documented mandatory rationale.

## Lifecycle
`requirements/profile authored → capability closure resolved → provider bindings qualified → realization planned → artifact closure built → deployment admitted → runtime observed → workload/SLO evidence collected → profile/realization revised → migration/cutover → residual cohort drained → old realization retired`.

A scaling event that changes only replica/resource allocation can be an in-place realization change. A topology/provider/storage/queueing change is a revisioned realization transition and consumes Lifecycle migration/rollback proofs.

## Versioning
Operational profile revisions are orthogonal to canonical business definition revisions. The same semantic revision may have multiple valid realization revisions. Conversely, a semantic change may or may not require a realization change depending on dependency and operational impact.

## Failure semantics
- `CLOSURE_INCOMPLETE` — required transitive dependency missing.
- `CLOSURE_UNEXPLAINED` — included component has no valid requirement/dependency lineage.
- `PROFILE_UNSATISFIED` — realization cannot meet declared operational obligations.
- `BINDING_UNQUALIFIED` — provider cannot satisfy required semantics/support vector.
- `REALIZATION_OUTCOME_UNKNOWN` — deployment/cutover acknowledgement is ambiguous; reconcile before retry.
- `RESIDUAL_DEPENDENCY_PRESENT` — capability/provider cannot be pruned because sessions, state, routes, subscriptions, caches or consumers still depend on it.
- `OFFLINE_CLOSURE_INCOMPLETE` — disconnected target lacks complete artifact/config/trust/provider material required for autonomous operation.

## Extensibility and provider boundaries
Capability packages/providers may add runtime components only through explicit contracts and dependency declarations. Provider replacement is allowed to change implementation/runtime dependencies, but must not force unrelated capabilities into the runtime closure. Provider-specific topology remains providerized; the Builder owns the portable requirement, binding and evidence contracts necessary to explain/verify the realization.

## Governance
Operational presets may exist for ergonomics but must expand into explicit revisioned requirements. They cannot become hidden editions, opaque pricing tiers or authority shortcuts. `Enterprise → Station → Role → Person` remains monotonic: a Station may constrain allowed providers/topologies/cost ceilings/SLO minima, and lower layers may specialize only within delegated authority.

Adaptive Governed Work Surfaces remain separate. AGWS/AI may express workload intent or propose a realization change, but cannot silently add capabilities, mutate canonical domain/process semantics, weaken enterprise SLO/security/residency constraints, select unapproved providers or acquire deployment/provider-admin authority.

## Observability
A realization is not proven by desired-state manifests alone. Acceptance requires observed evidence that the effective runtime satisfies the qualified capability/profile revision. Scaling evidence, saturation, latency, error rate, queue depth, resource pressure, recovery posture and provider health may trigger a new realization proposal, but observability does not own the semantic definition.

## Portability and offline closure
Portability requires separating portable operational obligations from provider-specific mechanics. A disconnected/air-gapped deployment must be exportable as a complete closure of required artifacts, runtime dependencies, configuration, trust material and provider-local requirements. Nix closure export/copy is strong evidence for the feasibility of closure completeness as a concept; it is not a mandate to adopt Nix.

## Lock-in analysis
Lock-in increases when workload intent is encoded directly as provider product SKUs, autoscaler-specific annotations or hidden platform defaults. The portable layer should capture intent such as throughput, concurrency, availability, RPO/RTO, isolation, region/residency and cost constraints, while provider adapters map those requirements to concrete mechanics and expose support vectors/gaps.

## Product-specific mechanisms vs universal primitives
Product-specific: Kubernetes HPA/RuntimeClass, Knative KPA, Lambda provisioned concurrency, Nix store paths, Bazel targets, Docker build stages.

Universal primitives supported by evidence:
- explicit transitive dependency closure;
- explainable inclusion lineage;
- build/runtime dependency separation;
- first-class operational requirement/profile revision;
- same semantics / multiple valid runtime realizations;
- provider-specific realization under portable obligations;
- residual-cohort drainage before pruning;
- offline-complete closure;
- observed effective-state acceptance.

## Convergent and divergent patterns
### Convergent
- Dependency closure can be computed from roots and explained by paths.
- Runtime images can omit build-only/unselected material.
- Runtime scale/topology is separable from application/business semantics.
- Operational demand is evidence for realization changes.
- Provider/runtime mechanics vary substantially and therefore belong behind portable requirements/bindings.

### Divergent
- Some systems resolve closure primarily at build/package time; others adapt only deployment topology at runtime.
- Autoscaling ranges from replica count to provider-specific concurrency allocation.
- Runtime substitution may be per-workload (Kubernetes RuntimeClass) or platform/provider-level.
- Offline closure is native in some package ecosystems and external operational work in others.

## Subcapabilities / ownership disposition
The four registered hypotheses do not justify four new top-level capabilities.

1. `G2-CAPABILITY-CANDIDATE-WORKLOAD-DRIVEN-RUNTIME-REALIZATION` — **MERGE_INTO_EXISTING_OWNERS / NOT_PROMOTED**. Cross-cutting synthesis of Deployment/Environment/Runtime + Provider Binding + Build + Observability + Security/Recovery.
2. `G2-CAPABILITY-CANDIDATE-MINIMAL-CAPABILITY-RUNTIME-CLOSURE` — **MERGE_INTO_BUILD_AND_DEPLOYMENT / NOT_PROMOTED**. Build owns deterministic artifact/dependency closure; Deployment owns instantiated runtime closure; Provider Binding contributes provider dependencies.
3. `G2-CAPABILITY-CANDIDATE-OPERATIONAL-PROFILE-SEPARATION` — **CROSS_CUTTING CONTRACT / NOT A CAPABILITY**. Promote the concept as a stable revisioned architecture contract/input, owned jointly at the boundary but with canonical schema ownership assigned during Planning A; it must remain orthogonal to business semantics.
4. `G2-CAPABILITY-CANDIDATE-RUNTIME-REALIZATION-EVOLUTION` — **MERGE_INTO_LIFECYCLE + DEPLOYMENT / NOT_PROMOTED**. Lifecycle owns transition/migration/rollback/drainage semantics; Deployment owns target realization; Build/Provider contribute new closure/bindings.

No new semantic owner is required. The negative-space gap is resolved by explicit cross-capability contracts and proof obligations.

## SB bounded comparison (fresh main only)
Fresh-main code search finds an `AssemblyPlan` with components identified by `capability`, `provider`, `version` and optional `dependencies`, plus compiler/product tests using explicit dependencies and compiler/runtime versions. This is evidence of a useful existing lineage substrate, not proof of minimal runtime closure, operational-profile separation, omission of unselected code, or same-semantics/different-topology realization. Direction: **KEEP + HARDEN + GENERALIZE** the current assembly/compiler contracts; do not infer that Generation 1 already satisfies this proof.

## Reconciliation hypotheses
- **KEEP** explicit capability/provider/version/dependency identity in AssemblyPlan.
- **HARDEN** dependency lineage so every emitted runtime component is explainable.
- **GENERALIZE** build planning to distinguish semantic capability closure, provider binding graph, operational profile, runtime realization and artifact manifest.
- **PROVIDERIZE** concrete autoscaling/runtime/topology/storage/queue/cache mechanics.
- **INTEGRATE** Lifecycle drainage/rollback, Observability evidence, Security/Recovery constraints and Technology Economic Governance constraints into realization qualification.
- **DO_NOT_BUILD** opaque fixed product tiers that silently imply topology or capability sets.
- **DEFER** arbitrary runtime hot-plugging; build/deploy-time controlled composition is sufficient for the current architectural proof.

## Repository-validation questions for Planning B
1. Does compiler output contain only selected/transitively-required capability implementation code, or does it ship a broader runtime hidden by flags?
2. Can each emitted file/package/process be traced to an AssemblyPlan capability/provider/dependency path?
3. Are build-only packages excluded from autonomous runtime artifacts?
4. Is there any existing operational/workload profile contract distinct from SystemDefinition semantics?
5. Can provider substitution alter only the affected closure without forcing unrelated modules into the artifact?
6. How are runtime processes/services derived from compiled components today?
7. Can a generated system run disconnected with all required artifacts/config/trust/provider-local dependencies available?
8. What proof exists for removing a capability/provider without residual state/session/route/subscription/cache consumers?

## Symbiotic Proof
A valid Generation 2 realization must demonstrate all of the following:

1. **Minimality** — a smaller selected capability graph yields a materially smaller explainable closure where optional components are technically separable.
2. **Completeness** — every required transitive dependency is present.
3. **Explainability** — every included component has requirement/dependency lineage.
4. **Semantic invariance** — changing replica count, runtime class, autoscaling or equivalent operational realization does not mutate canonical business semantics.
5. **Profile orthogonality** — two clients with the same semantic capability graph but different operational profiles can have different valid realization plans.
6. **Provider locality** — replacing one provider changes only affected binding/runtime dependencies unless an explicit dependency edge proves wider impact.
7. **Evolution safety** — realization revisions have explicit diff, migration, rollback and drainage evidence.
8. **Offline autonomy** — disconnected deployment has a complete locally satisfiable runtime closure and remains autonomous after build.
9. **Observed acceptance** — desired plan is not enough; effective runtime must be observed against the producing semantic/profile/binding revisions.
10. **Authority preservation** — Station/Role/Person and AGWS/AI cannot amplify capability, provider, deployment or canonical-domain authority.

## Stable findings
- **G2-FINDING-WDRR-01** — Minimal runtime closure is a typed, explainable transitive closure rooted in explicit semantic requirements; hidden/disabled unrelated capability code does not satisfy minimality when omission is technically feasible.
- **G2-FINDING-WDRR-02** — Build dependencies and runtime dependencies are distinct; build tooling can and should be excluded from the autonomous runtime unless it is an explicit runtime requirement.
- **G2-FINDING-WDRR-03** — Operational/workload requirements are first-class revisioned inputs orthogonal to canonical business semantics; user count alone is insufficient sizing authority.
- **G2-FINDING-WDRR-04** — The same semantic capability graph can legitimately have multiple runtime realizations (collapsed, replicated, isolated, autoscaled, different runtime classes) without capability inflation or business-semantic mutation.
- **G2-FINDING-WDRR-05** — Runtime realization is an applicability-scoped claim qualified by semantic definition, capability closure, provider bindings, operational profile, realization policy, build/toolchain and observed effective runtime revisions.
- **G2-FINDING-WDRR-06** — Provider substitution may alter implementation/topology closure but must not pull unrelated capabilities into the runtime without explicit dependency lineage; support-vector requalification is mandatory.
- **G2-FINDING-WDRR-07** — Capability/provider pruning requires reverse-dependency and residual-cohort proof across state, sessions, routes, subscriptions, caches, credentials and consumers before removal.
- **G2-FINDING-WDRR-08** — Offline/air-gapped autonomy requires a complete artifact/config/trust/provider-local closure prepared before disconnection; network reachability during build is not a runtime assumption.

## Value / risk / priority / next question
Value: HIGH — resolves whether Generation 2 can remain semantically broad while generated systems stay operationally proportional.
Risk: HIGH if omitted — the product could regress into a monolithic runtime, hidden product tiers or infrastructure concerns leaking into domain semantics.
Priority: GATE-CRITICAL.

Next question after this proof: artifact-to-runtime admission. The pipeline must prove that a release-qualified artifact plus realization plan and bindings becomes the observed intended runtime generation, with admission, configuration/trust/schema currentness and ambiguous-deployment reconciliation, before Enterprise Completeness can close.