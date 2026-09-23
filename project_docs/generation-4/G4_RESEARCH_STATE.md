# G4 Research State — System Builder Product R&D

Date: 2026-09-21
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE

## Purpose

Generation 4 follows G3 architectural closure and studies how the System Builder product should realize that semantic substrate with usable interaction, measurable performance, robust data/infrastructure engineering, controlled lifecycle management, bounded self-management and interoperable capability boundaries. G4 does not reopen G3 and does not authorize implementation, WBS, Work Packages, Sprints, TASKs, migrations or provider adoption.

This file is the compact consolidated state. Detailed evidence, adversarials, trade-offs and source-specific findings live in the dedicated documents under `project_docs/generation-4/research/`; compaction here does not supersede those durable research artifacts.

## Current research families

1. Product UX, Living Canvas & AI-native Builder interaction.
2. Computational Core & Performance Engineering.
3. Data, Persistence, Access & Infrastructure Access Engineering.
4. Data Treatment Engineering.
5. Infrastructure Engineering & Control Plane R&D.
6. Engineering Lifecycle, Product Change & Continuous Improvement.
7. Self-Hosting, Autonomic Control & Bounded Self-Evolution.
8. Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model.

These families may later be deduplicated or recomposed. A research family is not automatically a product module.

### Active product-interface consolidation

The Product UX / Living Canvas family now has a dedicated research artifact:
`research/G4_MAIN_COMPOSITION_CANVAS_3D_RESEARCH.md`.

Current interface hypothesis being researched:

- stable React/DOM shell with Office-style Ribbon, Tool Rail, WorkSurface, Inspector and Status/Activity bar;
- semantic 3D WorkSurface rather than decorative 3D;
- multiple projections of the same canonical model rather than one universal canvas;
- modules represented as flexible-height towers/pillars according to floor participation;
- floor manifestations as context-specific projections of one module identity;
- bounded context as semantic envelope plus internal onion/radial depth;
- capability participation as a cross-cutting axis/shaft, not ownership hierarchy;
- contracts as formal semantics/guarantees of access, exposed through ports/entry points;
- doors/counters as interaction metaphors for admissible boundaries and request/action surfaces;
- workflow/data-flow as trajectories through module structure rather than mandatory onion rings;
- vertical, horizontal and lateral hubs as primary structural interconnection primitives;
- handoffs/gates/evidence and designed-vs-observed conformance as operational overlays;
- server/host basements as deployment foundations from which runtime/module towers emerge;
- twin towers/availability groups for multiple manifestations of one logical module identity;
- explicit separation of visual grouping, semantic grouping and actual deployment mutation;
- desired/observed/effective placement remaining distinct;
- guided 3D navigation, semantic zoom, LOD, clustering, render-on-demand and non-3D accessibility fallbacks;
- permanent `Componentes` inventory/state-lab coverage for reusable canvas/topology elements.

Key research invariants added by this consolidation include `3D semantic != 3D decorative`, `Module Identity != Deployment Placement != Runtime Instance`, `Capability participation != semantic ownership`, `Visual connectability != semantic compatibility`, `Visual proximity != deployment merge`, `Arrange != Group != Deploy`, `Desired != Observed != Effective`, `Transport != Contract`, `Aggregation != silent omission` and `3D mode != mandatory interaction mode`.

This remains research-only and does not authorize renderer/package adoption or frontend implementation.

### OS-like shell evolution — modules as installed applications/windows

The existing frontend research direction is preserved and extended with an **OS-like operating-environment interaction model**.

Current hypothesis:

- the System Builder exposes a persistent System Desktop / workspace environment;
- modules behave like installed applications in the Builder;
- opening a module creates a ModuleWindow projection;
- the same module may have multiple simultaneous windows with different workspace/floor/projection contexts;
- the Office-style Ribbon remains global and receives contextual tabs from the focused ModuleWindow;
- Tool Rail, Inspector, Command Registry, Status/Activity and the permanent Componentes inventory remain valid;
- the semantic 3D canvas remains the System Map and can be opened as a dedicated window, docked workspace or spatial desktop projection;
- launcher/catalog, taskbar/open-window indicators, window docking/snapping/splitting, saved workspaces and background-module status become research candidates;
- module installation, module activation, window lifecycle, deployment manifestation and runtime instance remain distinct;
- Builder module-catalog breadth does not imply generated client runtime breadth.

New invariants include \`OS-like interaction shell != operating-system kernel\`, \`ModuleDefinition != ModuleInstallation != ModuleActivation != ModuleWindow != DeploymentManifestation != RuntimeInstance\`, \`Close Window != Disable != Uninstall != Undeploy\`, \`Focused Window != Selected Semantic Object\`, \`Window Z-order != architectural priority\`, \`Dock/Snap != semantic relation\`, \`UI lifecycle != module lifecycle != deployment lifecycle\` and \`Builder App Catalog breadth != Client Runtime breadth\`.

Detailed research is maintained in \`research/G4_MAIN_COMPOSITION_CANVAS_3D_RESEARCH.md\`.



## Cross-cutting rules

### Constitutional / product boundaries

- `G3 semantic decision != G4 technology binding`; `Research candidate != implementation authority`.
- `Polyglot-ready != Polyglot-from-day-one`; `Measured bottleneck -> qualified specialization candidate`.
- `Builder != Runtime`; published client runtimes remain autonomous.
- `Projection/index/cache/vector/telemetry != canonical truth`; `AI inference != authority`.
- `Self-managing != unrestricted self-modifying`.
- `Shared primitives != shared business ownership`; `Shared lifecycle semantics != shared authority`.
- `Logical Exchange Plane != single broker`; `Exchange Plane owns exchange semantics; capability owns business semantics`.
- `Interface compatibility != contract compatibility`; compatibility is multidimensional.
- Drivers/adapters/gateways may normalize or mediate only declared semantics; they must not fabricate equivalence or become accidental canonical owners.

### Exchange / effect boundaries

- `Provider ACK != effective state`; `Message/broker acceptance != consumer/business effect`.
- `Trace/correlation != business causation != authority`; `Cross-capability reference != ownership transfer`.
- `Workflow progress != transport progress`; `Compensation != rollback/time reversal`.
- `UNKNOWN` is an evidence-domain disposition, not permission to guess.
- `One interaction kind != one universal linearization point`.
- `Safety != liveness`; `Convergence != invariant preservation`; commutativity is contract/invariant-relative.
- Coordination scope follows the invariant; reservation/escrow is not a universal transaction replacement.
- `Idempotency != fencing`; `Target-local atomicity != cross-domain atomicity`.
- `Right transfer ACK != old holder fenced`; `Fencing token generated != fencing enforced`.
- `Ambiguous rights != free capacity`.

### Evolution / security / evidence boundaries

- `Latest deployment != in-flight semantic migration`; `Schema compatibility != obligation compatibility`.
- `Historical semantic continuity != historical executable continuity`; `Security retirement != semantic settlement`.
- `Signature/provenance valid != currently security-admissible`; `Previously trusted != indefinitely security-admissible`.
- `Offline autonomy != unlimited stale-security operation`; `Security currentness != business authority currentness`.
- `Revocation effective time != runtime observation time`; `Golden/A-B rollback != security-floor rollback`.
- `Evidence sufficient != payload retained`; security evidence is not a retention exemption.
- Historical semantic interpretation, continuation authority and new-effect admissibility remain distinct.

### Privacy / federation / proof boundaries

- `Proof continuity != global identity continuity`; `Dedup scope != global correlation scope`.
- `Proof of predicate != disclosure of source record`; `Federation != trust-domain collapse`.
- `Cryptographically unlinkable != operationally unlinkable`; privacy guarantees name observer/collusion assumptions.
- Rate, quota, cost, concurrency, capacity, issuance, redemption and anti-Sybil guarantees remain separately scoped.
- `Append-only transparency != non-equivocation`; quorum validity does not imply currentness.
- `All domains locally valid != cross-domain compatible state`; evidence aggregation cannot fabricate semantic compatibility.
- `Anti-rollback != anti-downgrade`; old/new policy coexistence is not permission union.
- `Text/AST diff != semantic policy diff`; `Same admitted request set != same guarantee vector`.
- `Proof verification != re-solving`; `Proof valid != translation correct`; producer provenance is distinct from semantic derivation.
- `Verifier installed != verifier qualified`; verifier replacement is a TCB/trust transition.
- `Two verifiers agree != proposition semantically valid`; differential disagreement is evidence, not majority truth.
- `Latest semantics != historical semantics`; proofs bind immutable semantic snapshots.
- `Semantic resolvability != current admissibility`; mutable aliases are not semantic identities.

### Profile negotiation / lifecycle boundaries

- `Supported profile != admissible profile for this interaction`; support, admissibility and preference are distinct.
- `Anti-downgrade != always choose numerically newest`; no common admissible profile does not permit fallback to arbitrary support intersection.
- Negotiation binds immutable semantic identity, peer/trust identity, interaction scope and security/currentness context.
- `Negotiated semantics != transport negotiation`; topology substitution preserves selected semantic identity.
- `Discovered support != negotiated contract`; advertisement is not proof of executed semantics.
- `Previously negotiated != indefinitely admissible`; cached evidence has identity/policy/floor/currentness horizons.
- `Negotiated once != admissible forever`; negotiation evidence has declared pinning scope/lifecycle.
- `Stream continuity != invisible semantic mutation`; queued-work admission semantics remain distinct from delivery-time execution admissibility.
- `Retry/redelivery/failover != new semantic admission`.
- `New implementation present != new semantic profile activated`.
- `Implementation rollback != semantic-profile rollback != security-floor rollback`.
- `Floor publication time != floor effective time != runtime observation time != effect time` where material.
- `Topology/path migration != semantic occurrence migration`.
- `Admission drained != effect obligations drained != historical interpretation drained`.

### Semantic generation handoff / recovery boundaries

- `Occurrence identity != one global semantic generation`; one occurrence may contain independently pinned branches.
- `Per-branch order != global order`; transport-local ordering cannot be extrapolated into total business order.
- `Cutover scope follows the protected invariant`; independent branches may advance separately.
- `All branch messages arrived != join predicate satisfied`; joins name effect/settlement/currentness requirements.
- `Generation marker observed != old generation fenced`; `Queue drained != old generation fenced`.
- `Batch transport boundary != semantic generation boundary`; batching does not create business atomicity.
- `Connection generation != stream/branch semantic generation`.
- `Delivery attempt generation != obligation semantic generation`; retry/redelivery retains lineage absent explicit migration/re-admission.
- Mixed-generation joins require semantic compatibility and authority/currentness qualification, not schema readability alone.
- Failure during handoff preserves a representable partial frontier rather than false completion.
- `Recoverable state != retained full history`; compacted frontiers may replace detail only when live safety/recovery questions remain answerable.
- `Compaction != semantic forgetting`; below-floor references require explicit behavior rather than fabricated absence.
- Transport replay, deduplication, semantic resolvability and authority/security horizons are independent.
- `Dedup window expired != old obligation became new`.
- `Checkpoint complete != external effects settled`.
- Negative/revocation/fencing evidence outlives resurrection paths or is subsumed by a stronger durable fence.

### Cross-runtime DR / split-brain boundaries

- `Frontier transferred != frontier admissible here`; evidence coverage across payload, progress, semantics, effects, authority, negative evidence and topology is multidimensional.
- `Replica complete for bytes != complete for semantic recovery`; provider-local cursor/checkpoint progress cannot manufacture effect settlement.
- `Endpoint moved != old effect authority fenced`; promotion is an authority transition where conflicting effects can occur.
- `RPO/RTO != semantic safety proof`; expected loss windows do not justify guessing a missing effect's disposition.
- `Failback != undo failover`; divergent post-promotion histories require reconciliation.
- `Connectivity restored != authority reconciled`; reconnection does not make either local latest state globally authoritative.
- `Histories mergeable != effects jointly admissible`; convergent data and irreversible/non-commutative side effects use different reconciliation laws.
- `Leader/lease elected != stale holder externally fenced`; effect-side exclusion must be enforced where the effect occurs or independently proven.
- `Latest timestamp != semantic winner`; wall-clock recency cannot invent ownership, conservation, settlement or security authority.
- Conflict resolution never erases historical external effects; dual-side effects remain facts with provenance/remediation obligations.
- Rejoin admission follows invariant-scoped authority reconciliation; independent invariants need not share a global barrier.

### Partition policy / degraded-mode boundaries

- `Capability degraded != every operation degraded identically`; degraded behavior is operation/interaction/invariant-scoped.
- `Dependency reachable != operation semantically admissible`; reachability, provider health, contract/profile compatibility, currentness, authority, effect rights and settlement are distinct dimensions.
- `Dependency unreachable != every operation must stop`; bounded stale reads, local convergence, preallocated rights or queue-without-effect may remain safe when explicitly contracted.
- `Health check green != operation admissible`; infrastructure health is not semantic/security authority.
- `Circuit open != business permission denied`; resilience path state is operational evidence, not canonical policy truth.
- `Graceful degradation != guarantee weakening by surprise`; hard safety/security/ownership invariants cannot be silently relaxed for availability.
- `Failover target healthy != failover target contract-compatible`; routing failover preserves or explicitly requalifies negotiated semantics.
- `Control plane unavailable != data plane must stop`; statically stable runtime operation may continue from locally durable state within declared currentness/security horizons.
- `Cached control-plane state != indefinitely current authority`; autonomy remains bounded by freshness/security policy.
- `Resource overload != semantic incompatibility`; load shedding and semantic admission are separate dimensions.
- `Borrowable execution capacity != borrowable authority/quota/effect rights`; resource scheduling cannot transfer business rights.
- `Dependency fallback succeeded != caller's original contract satisfied`; downstream degradation/lossiness propagates as qualified evidence through dependency composition.
- `Dependency healthy again != degraded obligations settled`; recovery requalifies queued, divergent, stale and unknown work.
- No central availability/health oracle becomes mandatory semantic authority for autonomous runtimes.

### Degraded dependency graph / guarantee synthesis boundaries

- `Dependency graph != orchestration ownership`; graph edges express required claims, not authority to own downstream business workflows.
- `Dependency graph != call graph`; semantic requirements can exist without a synchronous call and calls can be operationally incidental.
- `All dependencies returned != end-to-end guarantee satisfied`; root guarantees are constrained by material currentness, compatibility, authority, effect and settlement evidence.
- Hard, optional, alternative, conditional, effect-settlement, currentness/authority and resource-guard relations remain distinct.
- `Optional enrichment != hard dependency`; optionality is scoped to a root operation/guarantee and cannot be generalized globally.
- `Critical path != minimal semantic cut set`; a cut set is defined per protected invariant/guarantee rather than latency/topology centrality.
- `Fallback available != fallback contract-equivalent`; transparent substitution requires the required guarantee vector to remain satisfied.
- Guarantee synthesis cannot strengthen downstream evidence: `PARTIAL -> COMPLETE`, `UNKNOWN effect -> SETTLED`, or stale authority -> current authority requires explicit proof/irrelevance, never relabeling.
- `Retryable locally != safe to retry end-to-end`; retry ownership, stable effect identity and idempotency/dedup/fencing remain explicit.
- Retry/fallback attempt, time, concurrency, cost and queue budgets are end-to-end resources; child layers cannot silently mint additional budget.
- `Graph acyclic structurally != no feedback cycle`; retries, fallback recursion, queues, health flapping and recovery can form dynamic amplification loops.
- Bulkheads/circuit breakers/timeouts/backoff/jitter protect execution and failure domains but do not become business-semantic authority.
- Fan-out/fan-in completion depends on declared branch requirements/dispositions, not response count alone.
- Distributed/local admission from immutable contracts and locally sufficient evidence remains valid; no central graph/availability oracle is mandatory for autonomous runtimes.
- Recovery requalifies queued/retry obligations and drains backlog under bounded resource budgets rather than blindly reopening all paths.

### Distributed guarantee evidence cache / invalidation boundaries

- `Cache hit != current/admissible evidence`; reuse is scoped to the exact claim, operation, tenant/trust/classification, profile and authority context.
- `Same dependency != same cache key`; catalog currentness, provider health, authorization, effect settlement and profile compatibility are distinct claims.
- `Cache entry fresh for dimension X != fresh for dimension Y`; semantic, identity, security, business-currentness, effect and settlement horizons remain independent.
- `Invalidation sent != invalidation observed everywhere`; correctness for revocation/security-sensitive claims cannot rely solely on broadcast invalidation delivery.
- `Stale-but-allowed != current`; bounded stale use remains explicit in the root guarantee and may be prohibited by claim class.
- `Cached absence != proof of non-occurrence`; negative evidence is claim-scoped, bounded and distinct from `UNKNOWN`.
- A required minimum revision/currentness/security floor defeats cached evidence below that floor regardless of TTL.
- `Meets dependency floor != globally latest`; dependency-local tokens never create a synthetic global platform revision.
- `Older fetched evidence != permission to roll back local floor`; monotonic security/profile observations survive refresh/restart/rollback.
- Trust material from independent trust domains remains domain-qualified and cannot be merged for cache convenience.
- Derived/root evidence retains enough input lineage to detect material dependency supersession without requiring a central graph oracle.
- `Dependency changed != global cache flush`; only proof lineage materially dependent on the changed evidence is invalidated/lowered.
- `Cache stampede control != permission to extend semantic freshness`; coalescing, jitter and background refresh are operational containment.
- Offline cache reuse remains bounded by claim-specific horizons and locally sufficient security/currentness evidence.
- Provider/transport substitution requalifies provider-specific claims while independently immutable evidence may remain reusable when justified.
- Cache persistence/recovery cannot resurrect revoked or superseded evidence.

### Delegation semantic-mapping boundaries

- `Protocol/credential translation != semantic authority translation proof`; heterogeneous permission models require a qualified semantic relation, not a name conversion.
- Attenuation is directional containment over an explicit protected-effect/resource/context universe: every target-reachable protected effect must imply source permission; equality is not required unless separately contracted.
- `Role/scope name equality != authorization semantic equivalence`; effective authority includes material allow/deny, conditions, resource hierarchy, session/resource policies, boundaries and principal semantics.
- `Target grants fewer labels != target authority is weaker`; resource breadth, audience, impersonation and meta-capability closure can make it stronger.
- Material source deny/boundary/condition semantics must survive translation, be restored by complete mediation, be structurally excluded, or yield `PARTIAL/UNKNOWN/INCOMPATIBLE`.
- `Unknown/unsupported provider semantics != allow`; adapter normalization cannot strengthen evidence.
- `Target re-authorization != attenuation`; independently granted target authority creates a new authority/currentness/revocation edge.
- Mapping proof includes material meta-capability/acquisition closure; inability to execute an effect directly does not prove inability to acquire it.
- `Mapping unchanged != mapping proof current`; provider/API permission-universe growth, managed-role changes or evaluation-rule changes can defeat prior evidence.
- Simulator/conformance results are bounded qualification/counterexample evidence, not an omniscient live semantic oracle.
- Provider-specific authorization vocabularies may remain provider-specific; portability is in proof obligations/evidence vocabulary, not a mandatory universal authorization language.
- Adapter/gateway/Exchange Plane may transport or verify mapping evidence but do not become canonical owners of either domain's business authority.

## Research progression

```text
G3 CLOSED/FROZEN
 -> G4 research inventory
 -> workload / user / operational evidence
 -> benchmarks + prototypes + failure cases
 -> implementation-independent product architecture
 -> provider/technology comparison
 -> explicit planning authorization
 -> WBS / Work Packages / implementation
```

## Current maturity

- **Data/Persistence/Access:** `RESEARCH_ACTIVE`, not saturated.
- **Data Treatment:** `RESEARCH_ACTIVE`, not saturated.
- **Infrastructure Engineering:** `RESEARCH_ACTIVE`, not saturated.
- **Computational Core/Performance:** representative SB empirical benchmarks remain absent. `RESEARCH_ACTIVE`, not saturated.
- **Lifecycle/Continuous Improvement:** `RESEARCH_ACTIVE`, not saturated.
- **Self-Hosting/Autonomic Evolution:** `RESEARCH_ACTIVE`, not saturated.
- **Product UX/AI-native Builder:** `RESEARCH_ACTIVE`, not saturated.
- **Shared Semantic Kernel / Capability Exchange Plane:** material deep-evidence consolidation now extends through heterogeneous delegation semantic-mapping proof: directional effective-authority containment, deny/condition/resource/principal/meta-capability preservation, provider permission-universe version binding, explicit mediated/target-reauthorized/unknown outcomes and autonomous-runtime evidence closure without a universal authorization language or central semantic IAM oracle. `RESEARCH_ACTIVE`, not saturated.

## Latest material consolidation — 2026-09-21

### Delegation semantic-mapping proof across heterogeneous permission models

Evidence classes: AWS IAM primary documentation on effective policy evaluation, permissions boundaries, resource/session policy interaction and simulator limitations; Google Cloud IAM primary documentation on deny policies, Principal Access Boundaries, enforcement versions and policy evaluation; prior G4 semantic-policy proof, complete-mediation, effect-path, capability-envelope and offline-delegation research.

Material delta:

- reframed heterogeneous delegation translation as a directional implication/containment proof: target-reachable protected effects must imply source permission over a declared principal/resource/context universe;
- separated isolated role/scope mapping from **effective authority**, which may depend on allow/deny, boundaries, session/resource policies, hierarchy, conditions and principal shape;
- made source deny/condition semantics first-class: a target unable to represent a material restriction cannot receive an unqualified attenuation claim;
- introduced explicit outcomes `PROVEN_ATTENUATED`, `MEDIATED_ATTENUATION`, `TARGET_REAUTHORIZATION`, `PARTIAL/UNKNOWN` and `INCOMPATIBLE` rather than treating adapter success as semantic success;
- bound mapping evidence to provider/API/permission-universe semantics because managed-role contents and newly introduced permissions can defeat a prior proof without changing credential text;
- extended containment to meta-capability/acquisition closure so bind/escalate/impersonate/mint paths cannot escape the source authority envelope;
- preserved unknown/opaque provider semantics rather than converting schema compatibility or simulator output into invented equivalence;
- required complete-mediation evidence when an external gate restores a restriction absent from the target permission model;
- preserved autonomous runtime operation by making mapping proof/evidence locally carryable for declared horizons rather than requiring Builder/Exchange Plane online authorization;
- kept adapters, gateways and IAM providers as translation/enforcement mechanisms rather than semantic owners of business authority.

No AWS IAM, Google Cloud IAM/PAB, universal authorization language, policy engine, solver, gateway, adapter framework or provider was selected.

Highest-value remaining gap: **mapping-proof maintenance under opaque managed-role/provider-policy evolution** — determine how autonomous runtimes detect and requalify semantic drift when provider-managed roles, undocumented service authorization behavior, resource-policy layers or permission catalogs change without a local artifact revision, combining provider changelogs/catalogs, differential probes/simulators, runtime evidence, attestations and conservative floors without treating provider documentation or a central scanner as an omniscient semantic oracle.

## Prior material progression — compact index

Detailed durable evidence remains in the family documents indexed by `README.md`. Prior material deltas include reservation/escrow and fencing; effect composition; interaction reference models; semantic verification; causal workflow; multidimensional compatibility; hierarchical rights; non-fenceable/heterogeneous effects; in-flight evolution; security retirement/offline floors; evidence-minimal reconciliation; privacy-preserving evidence federation; collusion/metadata side channels; privacy-preserving abuse/rate/cost governance; federated anonymous budget conservation/Sybil resistance; privacy-preserving issuer accountability/compromise containment; witness/log governance/correlated compromise; multi-domain evidence composition; composition-policy lifecycle/downgrade/rollback safety; semantic non-downgrade/policy-diff proof; proof-carrying runtime verification; verifier trust continuity/diversity; normative proof-semantics governance/ambiguity containment; downgrade-resistant proof-semantics profile negotiation; negotiation-evidence lifecycle; semantic-generation handoff; handoff recovery/compaction; cross-runtime frontier transfer/disaster recovery; split-brain authority rejoin; operation-scoped degraded-mode capability contracts; degraded dependency-graph/end-to-end guarantee synthesis; distributed guarantee-evidence caching; revocation-storm/partition requalification; multi-domain invalidation algebra; in-flight policy composition change; effect-gate complete mediation; dynamic effect-path universe discovery; effect-capability privilege drift; offline delegation attenuation/revocation; and heterogeneous delegation semantic-mapping proof.

## Non-goals

- no Rust rewrite decision;
- no graph/vector/search/stream/service-mesh/central-exchange/etcd/Kubernetes adoption decision;
- no workflow/saga/migration/checkpoint/event-store/circuit-breaker engine adoption decision;
- no global serial-history/linearizability or global transaction requirement for all exchange interactions;
- no mandatory central broker/ESB/shared archive/availability/guarantee/cache/IAM oracle;
- no decision to make Builder an operating system;
- no unrestricted autonomous self-modification;
- no shared business model/database for integration convenience;
- no G4 implementation before explicit planning authorization.

## Closure target

G4 should eventually produce a deduplicated capability map; workload/interaction profiles; performance/scale budgets; proof obligations; implementation-independent target product architecture; provider qualification matrices; prototype evidence for high-risk choices; G3->G4 traceability; gap against current SB; and a planning handoff without automatically materializing implementation work.

## Scope addition — OS-style screen/window assembly

G4 Product UX / Frontend now explicitly includes research of a **System Builder Operating Environment** with operating-system-like screen and window composition.

In-scope research includes ModuleLauncher, WindowManager, ModuleWindow, ScreenComposer, WorkspaceComposer, taskbar/open-window state, docking/snapping/splitting, multiple windows per module, saved/restored layouts, suspend/hibernate/lazy-loading behavior, cross-window revision/currentness/conflict semantics, and synchronization with the semantic 3D System Map.

This extends rather than replaces the existing Ribbon, Tool Rail, Inspector, Command Registry, Componentes inventory, semantic 3D, floors/towers/onion/hubs and deployment-topology research.

New performance/lifecycle rules include \`Module installed != Module loaded\`, \`Module loaded != Module rendered\`, \`Module rendered != actively updating\`, \`Window open != full processing active\`, \`Installed complexity != runtime UI cost\` and \`Inactive workspace -> suspend / aggregate / unload where safe\`.

This remains research-only; it does not authorize implementation or adoption of a specific windowing/rendering framework.


## Scope addition — Factory Module as dense fleet operations console

G4 Product UX / Frontend now explicitly includes a **Factory Module** optimized for high-density multi-client operations rather than design-centric visualization.

The Factory Module is researched as a combined fleet console, operations console and factory-governance surface. It should emphasize virtualized tables/treegrids, compact status matrices/heatmaps, filtering/grouping, exception-first triage, drill-down, bulk selection and bounded operational commands across clients, systems, environments, modules, hosts, deployments and root services.

In-scope control research includes start/stop/restart, module/runtime restart, host stop/restart where supported, cordon/drain, enable/disable, pause/resume workers, scale, redeploy, rollback, reconcile, maintenance mode, quarantine/isolation, and qualified failover/promotion workflows. All actions remain provider/runtime-qualified and authority-bounded.

Factory control preserves \`Observe != Control != Change != Deploy\`, \`Operation ACK != Operational Effect != Business Readiness\`, \`Bulk request != atomic fleet transaction\`, \`Aggregate health != every member healthy/current\`, \`Cross-client visibility != cross-client authority\`, \`Secret metadata != secret value\`, \`Can operate != can read credential\`, \`Root Service != Client Module\` and \`Factory control plane != client semantic owner\`.

Detailed semantics, component inventory, bulk-action states, blast-radius preview, root-service handling and scale/performance hypotheses are maintained in \`research/G4_MAIN_COMPOSITION_CANVAS_3D_RESEARCH.md\`.


## Benchmark addition — web desktop reference systems

The OS-like frontend research now treats **Puter**, **OS.js** and **daedalOS** as priority external benchmarks.

- Puter: modern web-desktop experience and window/taskbar/app integration.
- OS.js: architectural benchmark for web-desktop window manager, application APIs, lifecycle/session services and React-capable app integration.
- daedalOS: rich desktop-in-browser behavior, context menus, drag/drop and multi-window interaction.

They are research references only: \`Benchmark != adoption\`, \`Similar interaction != copied visual identity\`, and external framework constraints do not define System Builder architecture.


## Research addition — frontend base vs web-desktop runtime ownership

G4 Frontend must now explicitly research whether OS-like windowing should be:

- implemented as System Builder-owned React/TypeScript infrastructure;
- delegated to a replaceable external windowing/desktop adapter while React/Next remains the base;
- or, only if evidence justifies it, hosted by an external desktop framework that owns the shell.

The current decision remains \`Next.js + React + TypeScript\` as frontend base. Puter, OS.js and daedalOS are benchmarks, not implementation authorities.

Research must compare ownership, lifecycle, performance, session restore, accessibility, React/Next integration, routing/SSR implications, Command Registry/Ribbon/Inspector integration, 3D WorkSurface embedding, Factory Module compatibility, testability, replaceability and lock-in.

Invariants: \`Desktop metaphor != desktop framework dependency\`, \`Window Manager != UI framework\`, \`React renderer != semantic authority\`, and \`External window library != ModuleDefinition/ModuleWindow/RuntimeInstance owner\`.


## Research addition — Application Portfolio / mature external tool reuse

G4 Frontend now includes explicit research of an **Application Catalog and Application Portfolio Matrix**.

The System Builder OS-like shell may contain many specialized applications, similar to a professional software suite. However:

~~~
Module != Capability != Application != Window
~~~

Research classes include native SB apps, API-backed SB apps, supported embedded external apps, proxied external apps, deep-linked apps, native-bridge apps and hybrids.

Priority infrastructure applications include Network Configurator, Docker/Container Manager, Task/Process Manager, Server Manager, Storage Manager, Terminal, Logs and Observability. Research should prefer official/versioned APIs and documented external components over reimplementing mature operational behavior.

Current evidence makes integration mode product-specific: Docker Engine has a versioned API with negotiation; Portainer exposes an API but blocks iframe embedding by default through CSP; Cockpit explicitly supports embedding/integrating documented components under same-origin/frame-security constraints.

Invariants include External tool != System Builder semantic owner, Embed capability != integration correctness, Official API compatibility != full feature equivalence, Deep link != failed integration, and Adapter normalization != fabricated semantic equivalence.


## Research addition — Builder Home and per-client Builder Desktops

G4 Product UX now includes a top-level Windows-like Builder Home / Factory Desktop from which Builder operators create/select client organizations and enter each client's dedicated Builder Desktop.

Identity must remain separated: User != Client Organization != Client System != Builder Desktop != Published Runtime.

A client organization may contain client users with delegated construction/administration privileges. Access to the Client Builder Desktop is separately scoped from edit, publish, deploy, operate, root-service and secret authority.

Each Client Builder Desktop may contain many specialized applications and saved workspaces. A workspace can focus on a branch/filial or organizational unit, but Workspace != Branch/Filial.

Deployment becomes a dedicated application capable of selecting qualified target profiles such as SB-managed server, container/Docker, orchestrated runtime, native server process, native desktop, edge host or external provider. Containerization is not mandatory semantics.

The generated/published client system remains an autonomous runtime, typically accessed conventionally through its own web endpoint/domain and using standardized System Builder-generated forms/views/components. Builder offline != Client Runtime offline.


## Direction update — Client -> Workspace -> Desktop Spheres; 3D deferred

The preferred G4 interaction hierarchy is now:

~~~
Client -> Workspace -> Desktop Sphere -> Application -> Window
~~~

Each Desktop Sphere represents a functional work area and exposes a stable catalog of relevant applications. Candidate spheres: System Design; Infrastructure & Runtime; Security/Identity/Governance; Data & Information; Process & Automation; Experience/Views/Forms/Reporting; Integrations & Exchange; Operations & Observability; Delivery & Lifecycle.

A workspace preserves client/system/revision/environment/organizational context across desktop switches. Desktops are UI/resource scopes, not business branches and not semantic owners.

Desktop taxonomy may be stable while actual application use remains dynamic: available != enabled != applicable != loaded != active.

Performance direction: load desktop shell/manifests first, lazy-load applications/windows, subscribe selectively, suspend/hibernate inactive work and unload closed desktop resources where safe. Close Desktop != stop service/runtime.

The semantic 3D work remains preserved but is deferred from the primary navigation model. Future 3D can return as an optional System Map/Topology application inside a desktop. 3D Projection != navigation foundation.



## Direction addition — Desktop Observatory

Each Client Desktop Sphere now includes a fixed, high-signal **Desktop Observatory** surface. It is not a Windows system tray and not a free-form widget canvas.

The Observatory gives contextual operational summaries for the active sphere: hosts, Docker daemons, containers, Portainer/provider availability, network/security/data/workflow/runtime state, incidents, jobs, drift and currentness.

Widgets provide summary and drill-down; full management remains in specialized applications.

Key distinctions: Running != healthy != ready != effective; No alert != healthy; Summary != canonical truth; Desktop widget != management application. Telemetry should be shared, scoped and suspendable rather than implemented as independent polling per widget.



## Research addition — Application Manager

G4 now includes a first-class Application Manager for lifecycle management of external/embedded applications.

Core flows:
- New Installation: choose app -> target -> prerequisites -> source/version -> runtime/network/storage/credentials -> install -> verify -> register -> observe -> expose in Desktop.
- Adopt Existing: discover or enter endpoint/host -> authenticate -> inspect version/capabilities -> verify compatibility -> register -> attach observability/control.

The manager must distinguish SB-managed, externally managed, co-managed, observe-only and discovered-unregistered instances.

Hard boundaries: Install != Adopt; Register != Deploy; Connect != Own; Discovered != Verified; Remove from Desktop != Uninstall; Unregister != Stop Service; Application record != secret storage.


## Research addition — Control Center / unified configuration

G4 now includes a first-class Control Center for unified cross-application configuration and governance.

The Control Center should expose application settings, provider/bindings, enablement, policies, secret/credential references, environments, endpoints, lifecycle/update rules, observability settings and desktop/app visibility without forcing users to configure every product separately.

Configuration remains scoped and provenance-aware across platform/client/system/environment/desktop/application/instance. Individual advanced settings remain available inside each application.

Key boundaries: unified settings UI != single semantic owner/store; secret reference != secret value; policy != configuration; desired != observed != effective; configured != applied != effective; inherited != explicitly set; global change != implicit restart/redeploy.


## Research addition — Declarative Service Deployment and auto-binding

G4 deployment UX now favors schema-driven service configuration over raw YAML/manifests.

Selecting a deployable service such as PostgreSQL should expose a typed configuration tree for version, storage, network, credentials, resources, health, observability, backup, placement and lifecycle. Environment context can automatically resolve network, internal hostname/service identity, secret namespace, storage defaults, observability and policy.

System-generated/provider-native YAML, Compose, Helm or service files are compiled/exportable artifacts, not the primary semantic authoring model.

Secrets are generated/imported through Vault policy and injected through SecretRef bindings. Deployment may be partitioned into multiple Deployment Units/placement groups rather than one giant manifest.

Preserve YAML/provider artifact != semantic definition; SecretRef != secret value; Automatic != hidden; Deployment Unit != physical server; Provider ACK != effective service.


## Research addition — guided windowing and extended multi-display desktop

G4 windowing now explicitly supports standardized application windows, tab groups, docking/snap/split layouts, linked-context window groups and saved layouts.

Primary hierarchy remains Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool.

A logical Workspace/Desktop may span multiple browser top-level surfaces/displays. Secondary browser windows/tabs act as DisplaySurfaces sharing the same workspace session, context and window registry, enabling dual-monitor workflows without treating each browser tab as an independent desktop.

Window movement/detachment is presentation/session behavior only; it must not change client/system/revision/environment/authority. Closing/minimizing a window changes UI resource lifecycle, not the external service/runtime lifecycle.

Preserve Desktop metaphor != unrestricted window chaos; Browser tab != SB tab; Display surface != Workspace; Docking != semantic dependency; Saved layout != permission grant.


## Research addition — declarative/opinionated UX and proprietary editor family

G4 frontend direction now explicitly distinguishes declarative behavior from unrestricted freedom. Users express desired state and intent; the platform guides valid sequencing, compatibility and provider realization.

The most engineering-intensive frontend work is expected in proprietary System Builder applications such as Workflow Designer, View/Form Builder, Component Editor, System/Module Designer, Rules/Decision Editor and Preview/Sandbox.

Workflow, views, forms and components must share semantic bindings rather than becoming isolated visual editors. Preserve View != Workflow Activity; Form != Workflow State; Button != Domain Command; Component event != authorized action.

Future WBS should avoid one monolithic frontend package and instead plan shared shell/primitives first, then proprietary application families, then cross-editor semantic integration and hardening.


## Research addition — Pinned Monitoring Surfaces

G4 now includes persistent desktop-resident monitoring surfaces for client/workspace-local observability.

A Pinned Monitoring Surface is a configurable mosaic of widgets that can remain fixed inside a Desktop Sphere, with explicit edit/lock/minimize/maximize/fullscreen/secondary-display controls.

It is distinct from the compact Desktop Observatory, the Operations Desktop and ordinary application windows.

These surfaces should preserve layout/bindings and currentness semantics while using shared/suspendable telemetry rather than independent polling per widget.

Hard boundaries: fixed layout != static data; pinned != semantic priority; monitoring surface != management application; visible widget != current evidence.


## G4 Web Desktop & Application Environment — formal research program

Status: ACTIVE_RESEARCH_PROGRAM / NON_EXECUTABLE

All recent interface concepts are now one explicit G4 research program. User examples/names are treated as exploratory hypotheses unless explicitly promoted to firm decisions.

### Program thesis

The System Builder frontend is researched as a web-based engineering operating environment rather than a conventional page-oriented SaaS.

Primary interaction hierarchy:

~~~
Builder Home / Factory
-> Client
-> Workspace
-> Desktop Sphere
-> Application
-> Window
-> View / Tab / Tool
~~~

3D is preserved as optional future projection/application research, not the mandatory navigation foundation.

### Mandatory research streams

1. Builder Home / client tenancy / delegated client access.
2. Workspace semantics: system, revision, environment, organizational/filial scope, saved context.
3. Desktop Spheres and stable application placement.
4. Window Manager: window roles, lifecycle, focus, z-order, minimize/maximize/restore, docking, snap, split, tab groups, detached windows and recovery.
5. Extended/multi-display desktop: one logical workspace across multiple browser display surfaces with shared window registry and context continuity.
6. Desktop Observatory: compact contextual operational summary.
7. Pinned Monitoring Surfaces / monitor walls: persistent configurable observability mosaics, editor, locking and secondary-display use.
8. Application Portfolio: native, API-backed, hybrid, embedded, proxied, deep-link and native-bridge applications.
9. Application Manager: catalog, install-new, adopt-existing, discovery, registration, ownership/management modes, upgrade/unregister/uninstall semantics.
10. Control Center: unified configuration, settings, policies, provider/bindings, secret references, environments, enablement, lifecycle and configuration search.
11. Declarative Service Deployment: schema-driven configuration, environment defaults, auto-binding, Vault references, network/storage/service identity and generated provider artifacts.
12. Hosting/placement profiles and shared/dedicated/external/existing service-placement hypotheses without prematurely freezing naming or commercial packaging.
13. External mature-tool integration research: Docker/Portainer, n8n, Cockpit/NetworkManager, Grafana/observability, database/storage/admin tools and analogous products.
14. Proprietary SB application family: Workflow Designer, Component Editor, View/Page Builder, Form Builder, Rules/Decision Editor, System/Module Designer, Elicitation, Preview/Sandbox, Revision/Diff.
15. Shared editor foundation: selection, outliner/tree, inspector, command registry, undo/redo, history/revision, diff, canvas/graph, bindings, expression/rule editor, state matrix, validation/findings, preview, evidence and accessibility.
16. Workflow/View/Form/Component semantic bridge: task/form/view/action/command/permission/workflow/evidence integration without collapsing semantic ownership.
17. Declarative + opinionated/guided authoring: make valid composition easier than invalid composition while preserving bounded flexibility and inspectable automation.
18. Performance/resource model: desktop/app/window lazy loading, suspension/hibernation, telemetry sharing, background throttling, graphics budgets and recovery.
19. Componentes catalog/playground coverage for shell, windows, applications, monitoring surfaces, editors, states, transitions and composition lineage.
20. Open-source/extensibility boundaries: application/plugin manifests, adapters/providers, replacement, version compatibility and anti-lock-in.

### Desktop Sphere hypotheses to research

- System Design;
- Infrastructure & Runtime;
- Security / Identity / Governance;
- Data & Information;
- Process & Automation;
- Experience / Views / Forms / Reporting;
- Integrations & Exchange;
- Operations & Observability;
- Delivery & Lifecycle.

Taxonomy is a research candidate, not a frozen product naming decision.

### Cross-cutting invariants

- Client != Workspace != Desktop != Application != Window.
- Workspace scope != Desktop sphere.
- Module != Capability != Application != Window.
- Window/session lifecycle != service/runtime lifecycle.
- Close/minimize UI != stop/disable/undeploy service.
- Desktop presence != application loaded.
- Application availability != applicability != active state.
- Unified configuration UI != one semantic owner or one physical store.
- SecretRef != secret value.
- Policy != configuration.
- Desired != observed != effective.
- Configured != applied != effective.
- Install != Adopt.
- Register != Deploy.
- Connect != Own.
- Discovered != Verified.
- Remove from Desktop != Uninstall.
- YAML/provider artifact != canonical semantic definition.
- Automatic != hidden.
- Deployment Unit != physical server.
- Service identity != raw IP.
- Desktop widget != management application.
- Observatory != Monitoring Surface != Operations Desktop.
- Pinned != semantic priority.
- Display Surface != Workspace.
- Window movement/docking != semantic relation.
- Browser tab != System Builder tab.
- 3D projection != navigation foundation.
- View != Workflow Activity.
- Form != Workflow State.
- Button != Domain Command.
- Component event != authorized business action.
- Adapter normalization != fabricated semantic equivalence.

### Required research outputs before implementation planning

- Web Desktop architecture decision record;
- Desktop Sphere taxonomy/boundary study;
- Window Manager contract and state machine;
- multi-display/session synchronization model;
- Application Portfolio Matrix;
- external-app integration/security matrix;
- Application Manager lifecycle model;
- Control Center configuration/inheritance/provenance model;
- declarative deployment/service-definition model;
- Vault/secret auto-binding and environment-binding model;
- Monitoring Surface/Observatory component and telemetry model;
- proprietary editor shared-primitives architecture;
- Workflow/View/Form/Component binding model;
- accessibility and small-screen equivalent-operation model;
- performance budgets and suspension/resource lifecycle;
- failure/recovery/session restore model;
- adversarial scenario/proof-obligation matrix;
- componentization/complexity map suitable for later WBS.

### Research method

Use current external evidence from mature systems, documentation and papers where relevant. Benchmark interaction grammar and architectural patterns rather than copying branding or proprietary implementation.

Test contradictory evidence and alternatives. Research continues until material gaps show saturation; no research result by itself grants implementation authority.


## Research addition — unified assembly grammar

G4 now treats install/configure/bind/validate as a general interaction grammar for infrastructure services and semantic building blocks alike: modules, capabilities, gateways, providers, workflow/data/UI packages and integrations.

Normal flow: `ADD/INSTALL -> CONFIGURE -> BIND/CONNECT -> VALIDATE -> APPLY -> OBSERVE -> TUNE/EVOLVE`.

Research typed connection points/`sockets` so the UI can surface compatible bindings and guide assembly without making visual connection itself semantic authority.

Preserve `Installed != Configured != Bound != Verified != Effective` and GUI/Wizard/declarative-first with terminal/raw config as advanced escape hatches.


## Research addition — Desktop-aware Start/Application Hub

G4 now includes a persistent Start-style launcher paired with the Desktop selector. The launcher is context-aware: its categories, ranking and featured applications adapt to the active Desktop Sphere while shared/global applications such as Control Center/Configuration Manager/Application Manager remain consistently discoverable.

Service categories can mix native SB capabilities and external supported products behind a coherent install/adopt/configure/bind/validate/open flow.

Preserve CatalogApplicationDefinition != InstalledApplicationInstance != RunningWindow; Desktop context != application identity; menu visibility != permission grant.
